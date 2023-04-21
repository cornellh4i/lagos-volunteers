import { Request, Response } from "express";
import { EventMode, EventStatus, Event, EventEnrollment } from "@prisma/client";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Creates a new event and assign owner to it.
 * @param name (String)
 * @param subtitle (String)
 * @param Location (String)
 * @param Description (String)
 * @param startDate (DateTime)
 * @private endDate (DateTime)
 * @param Mode (EventMode)
 * @param Status (EventStatus)
 * @returns promise with event or error.
 */
const createEvent = async (userID: string, req: Request) => {
  // weird typescript error here with the prisma event type
  return prisma.event.create({
    data: {
      ...req.body,
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
 * Get all events in DB
 * @returns promise with all events or error
 */
const getEvents = async () => {
  return prisma.event.findMany({});
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
