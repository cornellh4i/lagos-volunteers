import { Request, Response } from "express";
import {
  EventMode,
  EventStatus,
  Event,
  EventEnrollment,
  Prisma,
} from "@prisma/client";
import { EventDTO } from "./views";
import userController from "../users/controllers";
import prisma from "../../client";
import sgMail from "@sendgrid/mail";

/**
 * Creates a new event and assign owner to it.
 * @param eventDTO contains the ownerID and the event body
 * @returns promise with event or error.
 */
const createEvent = async (eventDTO: EventDTO) => {
  // weird typescript error here with the prisma event type
  const { userID, event } = eventDTO;
  return prisma.event.create({
    data: {
      ...event,
      owner: {
        connect: {
          id: userID,
        },
      },
    },
  });
};

/**
 * Deletes specified event by eventID.
 * @param eventID (String)
 * @returns promise with eventID or error.
 */
const deleteEvent = async (eventID: string) => {
  return prisma.event.delete({
    where: {
      id: eventID,
    },
  });
};

/**
 * Search, sort and pagination for events
 * @param filter are the filter params passed in
 * @param sort are sort params passed in
 * @param pagination are the pagination params passed in
 * @returns promise with list of events
 */
const getEvents = async (
  filter: {
    upcoming?: string;
    ownerId?: string;
    userId?: string;
  },
  sort: {
    key: string;
    order: Prisma.SortOrder;
  },
  pagination: {
    after: string;
    limit: string;
  }
) => {
  /* SORTING */

  // Handles GET /events?sort=location:desc
  const defaultCursor = { id: "asc" };
  const sortDict: { [key: string]: any } = {
    default: { id: sort.order },
    name: [{ name: sort.order }, defaultCursor],
    location: [{ location: sort.order }, defaultCursor],
  };

  /* PAGINATION */

  // Handles GET /events?limit=20&after=asdf
  let cursor = undefined;
  let skip = undefined;
  if (pagination.after) {
    cursor = {
      id: pagination.after as string,
    };
    skip = 1;
  }
  let take = undefined;
  if (pagination.limit) {
    take = parseInt(pagination.limit as string);
  } else {
    // default take is 10
    take = 10;
  }

  /* FILTERING */

  let whereDict: { [key: string]: any } = {};
  let includeDict: { [key: string]: any } = {};

  // Handles GET /events?upcoming=true and GET /events?upcoming=false
  // TODO: Investigate creating events that occur in a few minutes into the future
  const dateTime = new Date();
  if (filter.upcoming === "true") {
    whereDict["startDate"] = {
      gt: dateTime,
    };
  } else if (filter.upcoming === "false") {
    whereDict["endDate"] = {
      lt: dateTime,
    };
  }

  // Handles GET /events?ownerId=asdf
  if (filter.ownerId) {
    whereDict["ownerId"] = filter.ownerId;
  }

  // Handles GET /events?userId=asdf
  if (filter.userId) {
    whereDict["attendees"] = {
      some: {
        userId: filter.userId,
      },
    };
  }

  // Need to find the total number of records before pagination
  const totalNumberOfRecords = await prisma.event.count({
    where: {
      AND: [whereDict],
    },
  });

  /* RESULT */

  const queryResult = await prisma.event.findMany({
    where: {
      AND: [whereDict],
    },
    include: includeDict,
    orderBy: sortDict[sort.key],
    take: take,
    skip: skip,
    cursor: cursor,
  });

  const lastPostInResults = take
    ? queryResult[take - 1]
    : queryResult[queryResult.length - 1];
  const myCursor = lastPostInResults ? lastPostInResults.id : undefined;
  return {
    result: queryResult,
    cursor: myCursor,
    totalItems: totalNumberOfRecords,
  };
};

/**
 * Updates an event
 * @param event (Event) event body
 * @param eventID (String)
 * @returns promise with eventID or error.
 */
const updateEvent = async (eventID: string, event: Event) => {
  return prisma.event.update({
    where: {
      id: eventID,
    },
    data: {
      ...event,
    },
  });
};

/**
 * Get all events with a start date after Date.now()
 * @returns promise with all events or error
 */
const getUpcomingEvents = async () => {
  const dateTime = new Date();
  return prisma.event.findMany({
    where: {
      startDate: {
        gt: dateTime,
      },
    },
  });
};

/**
 * Get all events with a start date before Date.now() and an end date
 * after Date.now()
 * @returns promise with all events or error
 */
const getCurrentEvents = async () => {
  const dateTime = new Date();
  return prisma.event.findMany({
    where: {
      startDate: {
        lt: dateTime,
      },
      endDate: {
        gt: dateTime,
      },
    },
  });
};

/**
 * Get all events all events with an end date before Date.now()
 * @returns promise with all events or error
 */
const getPastEvents = async () => {
  const dateTime = new Date();
  return await prisma.event.findMany({
    where: {
      endDate: {
        lt: dateTime,
      },
    },
  });
};

/**
 * Get all event info by eventID
 * @param eventID (String)
 * @returns promise with all event info or error
 */
const getEvent = async (eventID: string) => {
  return prisma.event.findUnique({
    where: {
      id: eventID,
    },
    include: {
      owner: {
        select: {
          profile: true,
        },
      },
      tags: true,
    },
  });
};

/**
 * Gets all attendees registered for an event
 * @param eventID (String)
 * @param userID (String)
 * @returns promise with all attendees of the event or error
 */
const getAttendees = async (eventID: string, userID: string) => {
  if (userID) {
    // If userID is provided, return only the attendee connected to the userID and eventID
    return prisma.eventEnrollment.findUnique({
      where: {
        userId_eventId: {
          userId: userID,
          eventId: eventID,
        },
      },
      include: {
        user: true,
        event: true,
      },
    });
  }

  // if userID is not provided, return all attendees of the event
  return prisma.eventEnrollment.findMany({
    where: {
      eventId: eventID,
    },
    include: {
      user: true,
    },
  });
};

/**
 * Adds specified user to an event
 * @param eventID (String)
 * @param attendeeID (String) id of user to add to event
 * @returns promise with user or error
 */
const addAttendee = async (eventID: string, userID: string) => {
  // grabs the user and their email for SendGrid fucntionality
  const user = await userController.getUserByID(userID);
  const userEmail = user?.email;
  // sets the email message
  const emailMsg = "USER WAS REGISTERED";
  if (process.env.NODE_ENV !== "test") {
    await sendEmail(userEmail, emailMsg);
  }
  return await prisma.eventEnrollment.create({
    data: {
      event: {
        connect: {
          id: eventID,
        },
      },
      user: {
        connect: {
          id: userID,
        },
      },
    },
  });
};

/**
 * Sends an email to the specified address
 * @param email is the email address to send to
 * @param message is the email body
 */
const sendEmail = async (email: string | undefined, message: string) => {
  // Create an email message
  const msg = {
    to: email, // Recipient's email address
    from: "lagosfoodbankdev@gmail.com", // Sender's email address
    subject: "Your Email Subject",
    text: message, // You can use HTML content as well
  };

  // Send the email
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

/**
 * Remove the specified user from the event
 * @param eventID (String)
 * @param userID (String) id of user to add to event
 * @returns promise with eventid or error
 */
const deleteAttendee = async (
  eventID: string,
  userID: string,
  cancelationMessage: string
) => {
  // grabs the user and their email for SendGrid fucntionality
  const user = await userController.getUserByID(userID);
  var userEmail = user?.email;

  // sets the email message
  const emailMsg = "USER REMOVED FROM THIS EVENT";
  if (process.env.NODE_ENV != "test") {
    await sendEmail(userEmail, emailMsg);
  }

  // update db
  return await prisma.eventEnrollment.update({
    where: {
      userId_eventId: {
        userId: userID,
        eventId: eventID,
      },
    },
    data: {
      canceled: true,
      cancelationMessage: cancelationMessage,
    },
  });
};

/**
 * Update the event status
 * @param eventID (String)
 * @param status (String) new status of event
 * @returns promise with event or error
 */
const updateEventStatus = async (eventID: string, status: string) => {
  return await prisma.event.update({
    where: {
      id: eventID,
    },
    data: {
      status: status as EventStatus,
    },
  });
};

/**
 * Update the event owner
 * @param eventID (String)
 * @param ownerID (String) id of owner
 * @returns promise with event or error
 */
const updateEventOwner = async (eventID: string, ownerID: string) => {
  return await prisma.event.update({
    where: {
      id: eventID,
    },
    data: {
      ownerId: ownerID,
    },
  });
};

/**
 * Confirm the attendance of the specified user at the event
 * @param eventID (String)
 * @param userID (String) id of user
 * @returns promise with event or error
 */
const confirmUser = async (eventID: string, userID: string) => {
  return await prisma.eventEnrollment.update({
    where: {
      userId_eventId: {
        userId: userID,
        eventId: eventID,
      },
    },
    data: {
      showedUp: true,
    },
  });
};

export default {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
  getUpcomingEvents,
  getCurrentEvents,
  getPastEvents,
  getEvent,
  getAttendees,
  addAttendee,
  deleteAttendee,
  updateEventStatus,
  updateEventOwner,
  confirmUser,
};
