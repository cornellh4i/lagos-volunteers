import { Request, Response } from "express";
import {
  EventMode,
  EventStatus,
  Event,
  EventEnrollment,
  Prisma,
} from "@prisma/client";
import { EventDTO } from "./views";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

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
 * Search, Sort and Pagination for Events
 * [option] corresponds to the columns in the Event table.
 * Search supports multiple queries
 * The following options are supported:
 * @param upcoming if the event is upcoming then true, else false
 * @param sort possible sort columns: name, location
 * @param ownerid all events that were created by ownerid
 * @param userid all events such that userid is registered 
 * @param req: Request paramters to get query used for search
 * @returns  promise with list of all events where [option] is [value]

 */
const getEvents = async (req: Request) => {
  const query = req.query;
  let upcoming = query.upcoming;
  let whereDict: { [key: string]: any } = {};
  let includeDict: { [key: string]: any } = {};
  if (upcoming) {
    if (upcoming == "true") {
      const dateTime = new Date();
      whereDict["startDate"] = {
        gt: dateTime,
      };
    }
  }
  const sortQuery = query.sort as string;
  const defaultCursor = { id: "asc" };
  const querySplit = sortQuery ? sortQuery.split(":") : ["default", "asc"];
  const key: string = querySplit[0];
  const order = querySplit[1] as Prisma.SortOrder;
  const sortDict: { [key: string]: any } = {
    default: { id: order },
    name: [{ name: order }, defaultCursor],
    location: [{ location: order }, defaultCursor],
  };

  const ownerId = query.ownerid;
  if (ownerId) {
    whereDict["ownerId"] = ownerId;
  }
  const userId = query.userid;
  if (userId) {
    whereDict["attendees"] = {
      some: {
        userId: userId,
      },
    };
  }
  let cursor = undefined;
  let skip = undefined;
  if (query.after) {
    cursor = {
      id: query.after as string,
    };
    skip = 1;
  }
  let take = undefined;

  if (query.limit) {
    take = parseInt(query.limit as string);
  }else{
    // default take is 10
    take = 10;
  }

  const queryResult = await prisma.event.findMany({
    where: {
      AND: [whereDict],
    },
    include: includeDict,
    orderBy: sortDict[key],
    take: take,
    skip: skip,
    cursor: cursor,
  });
  const lastPostInResults = take
    ? queryResult[take - 1]
    : queryResult[queryResult.length - 1];
  const myCursor = lastPostInResults ? lastPostInResults.id : undefined;
  return { result: queryResult, cursor: myCursor };
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
  });
};

/**
 * Gets all attendees registered for an event
 * @param eventID (String)
 * @returns promise with all attendees of the event or error
 */
const getAttendees = async (eventID: string) => {
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
 * @param attendeeID (String) id of user to add to event
 * @returns promise with eventid or error
 */
const deleteAttendee = async (eventID: string, userID: string) => {
  return await prisma.eventEnrollment.delete({
    where: {
      userId_eventId: {
        userId: userID,
        eventId: eventID,
      },
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
