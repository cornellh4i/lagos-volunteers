import { Request, Response } from "express";
import {
  EventMode,
  EventStatus,
  Event,
  EventEnrollment,
  Prisma,
  EnrollmentStatus,
} from "@prisma/client";
import { EventDTO } from "./views";
import userController from "../users/controllers";
import prisma from "../../client";
import { sendEmail, replaceInText, replaceEventInputs } from "../utils/helpers";

import fs from "fs"; // importing built-in file system

/**
 * Creates an object utf8 that can encode the buffer and convert to string.
 * Creates an object for each html file to return a string.
 */
const utf8: BufferEncoding = "utf8";
const stringEventUpdate: string = fs.readFileSync(
  "./src/emails/Event_Update.html",
  utf8
);
const stringUserUpdate: string = fs.readFileSync(
  "./src/emails/User_Update.html",
  utf8
);

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
  },
  include: {
    attendees: boolean;
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
  let includeDict: { [key: string]: any } = include;

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

  let queryOptions = {
    where: { AND: [whereDict] },
    include: includeDict,
    orderBy: sortDict[sort.key],
    take: take,
    skip: skip,
  };

  // Find the total number of records before pagination is applied
  const totalRecords = await prisma.event.count({
    where: {
      AND: [whereDict],
    },
  });

  /* RESULT */
  let queryResult;
  if (cursor) {
    queryResult = await prisma.event.findMany({
      ...queryOptions,
      cursor,
    });
  } else {
    queryResult = await prisma.event.findMany({
      ...queryOptions,
    });
  }
  let lastPostInResults;
  if (queryResult.length > 0) {
    lastPostInResults = queryResult[queryResult.length - 1];
  }
  const nextCursor = lastPostInResults?.id;
  const prevCursor = queryResult[0] ? queryResult[0].id : undefined;
  return {
    result: queryResult,
    nextCursor: nextCursor,
    prevCursor: prevCursor,
    totalItems: totalRecords,
  };
};

/**
 * Updates an event
 * @param event (Event) event body
 * @param eventID (String)
 * @returns promise with eventID or error.
 */
const updateEvent = async (eventID: string, event: Event) => {
  const eventDetails = await getEvent(eventID);
  const currentDate = new Date();
  if (eventDetails) {
    if (eventDetails.startDate < currentDate) {
      return Promise.reject("Event has already started");
    }
  }

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
      attendees: true,
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
 * Returns a boleean indicating whether event is past or not
 * @param eventID (String)
 * @returns promise with boolean or error
 */
export const isEventPast = async (eventID: string) => {
  const currentDateTime = new Date();
  const event = (await getEvent(eventID)) as Event;
  const eventDate = new Date(event.startDate);
  return eventDate < currentDateTime;
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

const updateEnrollmentStatus = async (
  eventID: string,
  userID: string,
  newStatus: EnrollmentStatus
) => {
  return await prisma.eventEnrollment.update({
    where: {
      userId_eventId: {
        userId: userID,
        eventId: eventID,
      },
    },
    data: {
      attendeeStatus: newStatus,
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
  const user = await userController.getUserProfile(userID);
  const userEmail = user?.email as string;
  var userName = user?.profile?.firstName as string;
  const event = await getEvent(eventID);
  var eventName = event?.name as string;
  var eventLocation = event?.location as string;
  var eventDateTimeUnknown = event?.startDate as unknown;
  var eventDateTimeString = eventDateTimeUnknown as string;
  var textBody = "Your registration was successful.";
  const eventIsInThePast = await isEventPast(eventID);

  if (process.env.NODE_ENV != "test" && !eventIsInThePast) {
    // creates updated html path with the changed inputs
    const updatedHtml = replaceEventInputs(
      stringEventUpdate,
      eventName,
      userName,
      eventDateTimeString,
      eventLocation,
      textBody
    );
    const userPreferences = await userController.getUserPreferences(userID);
    if (userPreferences?.preferences?.sendEmailNotification === true) {
      await sendEmail(
        userEmail,
        "Your registration was successful.",
        updatedHtml
      );
    }
  }
  if (eventIsInThePast) {
    return Promise.reject("Event is past, cannot enroll new user");
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
  const user = await userController.getUserProfile(userID);
  var userEmail = user?.email as string;
  var userName = user?.profile?.firstName as string;
  const event = await getEvent(eventID);
  var eventName = event?.name as string;
  var eventLocation = event?.location as string;
  var eventDateTimeUnknown = event?.startDate as unknown;
  var eventDateTimeString = eventDateTimeUnknown as string;
  var textBody = "Your event cancellation was successful.";

  if (process.env.NODE_ENV != "test") {
    // creates updated html path with the changed inputs
    const updatedHtml = replaceEventInputs(
      stringEventUpdate,
      eventName,
      userName,
      eventDateTimeString,
      eventLocation,
      textBody
    );
    const userPreferences = await userController.getUserPreferences(userID);
    if (userPreferences?.preferences?.sendEmailNotification === true) {
      await sendEmail(
        userEmail,
        "Your event cancellation was successful.",
        updatedHtml
      );
    }
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
      attendeeStatus: "CANCELED",
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
  if (await isEventPast(eventID)) {
    return Promise.reject("Event is past, cannot update status");
  }

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
  const user = await userController.getUserProfile(userID);
  var userEmail = user?.email as string;
  var userName = user?.profile?.firstName as string;
  const event = await getEvent(eventID);
  var eventName = event?.name as string;
  var eventLocation = event?.location as string;
  var eventDateTimeUnknown = event?.startDate as unknown;
  var eventDateTimeString = eventDateTimeUnknown as string;
  var textBody = "Your attendance at the following event has been confirmed.";

  if (process.env.NODE_ENV != "test") {
    const updatedHtml = replaceEventInputs(
      stringEventUpdate,
      eventName,
      userName,
      eventDateTimeString,
      eventLocation,
      textBody
    );
    const userPreferences = await userController.getUserPreferences(userID);
    if (userPreferences?.preferences?.sendEmailNotification === true) {
      await sendEmail(
        userEmail,
        "Your attendance has been confirmed",
        updatedHtml
      );
    }
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
  updateEnrollmentStatus,
};
