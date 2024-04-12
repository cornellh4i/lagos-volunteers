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
import { sendEmail } from "../utils/helpers";

import fs from "fs"; // importing built-in file system

/**
 * Creates an object utf8 that can encode the buffer and convert to string.
 * Creates an object for each html file to return a string.
 */
const utf8: BufferEncoding = "utf8";
const stringRegUpdate: string = fs.readFileSync(
  "Registration_Update.html",
  utf8
);
const stringCertApprove: string = fs.readFileSync(
  "Certificate_Approval.html",
  utf8
);
const stringBlacklist: string = fs.readFileSync("Blacklisted.html", utf8);
const stringVolunSuper: string = fs.readFileSync(
  "Volunteer_Supervisor.html",
  utf8
);
const stringSuperAdmin: string = fs.readFileSync("Supervisor_Admin.html", utf8);

/**
 * Creates an object utf8 that can encode the buffer and convert to string.
 * Creates an object for each html file to return a string.
 */

const htmlRegUpdate = "./src/emails/Registration_Update.html";
const htmlCertApprove = "./src/emails/Certificate_Approval.html";
const htmlBlacklist = "./src/emails/Blacklisted.html";
const htmlVolunSuper = "./src/emails/Volunteer_Supervisor.html";
const htmlSuperAdmin = "./src/emails/Supervisor_Admin.html";
const htmlAttendConfirm = "./src/emails/Attendance_Confirmation.html";

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
    date?: string;
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
    startDate: [{ startDate: sort.order }, defaultCursor],
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

  // Handles GET /events?date=upcoming and GET /events?date=past
  // TODO: Investigate creating events that occur in a few minutes into the future
  const dateTime = new Date();
  switch (filter.date) {
    case "upcoming":
      // An event that has started but not ended is still considered upcoming
      whereDict["endDate"] = {
        gte: dateTime,
      };
      break;
    case "past":
      // An event is considered past if it has ended
      whereDict["endDate"] = {
        lt: dateTime,
      };
      break;
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

  // Find the total number of records before pagination is applied
  const totalRecords = await prisma.event.count({
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
  return { result: queryResult, cursor: myCursor, totalItems: totalRecords };
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
  // grabs the user and their email for SendGrid functionality
  const user = await userController.getUserByID(userID);
  const userEmail = user?.email as string;

  const subject = "Your email subject here";
  // const path = "./src/emails/test2.html";

  if (process.env.NODE_ENV !== "test") {
    await sendEmail(userEmail, subject, htmlRegUpdate);
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
  // grabs the user and their email for SendGrid functionality
  const user = await userController.getUserByID(userID);
  var userEmail = user?.email as string;
  var userName = user?.firstName as string;
  const event = await getEvent(eventID);
  var eventName = event?.name as string;
  var eventLocation = event?.location as string;
  var eventDateTimeUnknown = event?.startDate as unknown;
  var eventDateTimeString = eventDateTimeUnknown as string;

  function replaceInText(
    originalString: string,
    placeholder: string,
    replacement: string
  ) {
    //const safePlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp("\\[" + placeholder + "\\]", "g");
    return originalString.replace(regex, replacement);
  }

  // sets the email message
  // const emailHtml = "<b>htmlRegCancel</b>";
  const emailHtml = "<b>email here, EVENT NAME...</b>";
  //   async function prepareAndSendEmail(userEmail: string, eventName: string) {
  //     // Replace the placeholder in the email template with the actual event name
  //     const updatedEmailHtml = replaceInText(emailHtml, "\\[EVENT NAME\\]", eventName);

  //     // Send the email if not in test environment
  //     if (process.env.NODE_ENV !== "test") {
  //         await sendEmail(userEmail, "Your Event Details", updatedEmailHtml);
  //     }
  // }

  function replaceInputs() {
    // checks emailHTML string, finds instances of EVENT NAME and replaces it with ${event.name}
    // change path instead to the html file with the replaced "variables" given eventid or userid
    return replaceInText(emailHtml, "EVENT NAME", eventName);
    return replaceInText(emailHtml, "USER NAME", userName);
    return replaceInText(emailHtml, "EVENT DATETIME", eventDateTimeString);
    return replaceInText(emailHtml, "EVENT LOCATION", eventLocation);
  }
  if (process.env.NODE_ENV != "test") {
    await sendEmail(userEmail, "Your email subject", htmlRegUpdate);
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
  const user = await userController.getUserByID(userID);
  var userEmail = user?.email as string;
  if (process.env.NODE_ENV != "test") {
    await sendEmail(userEmail, "Your email subject", htmlAttendConfirm);
  }

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
