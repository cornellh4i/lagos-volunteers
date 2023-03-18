import { Request, Response } from "express";
import { EventMode, EventStatus } from "@prisma/client";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Creates a new event with information specified in the request body.
 * Request body includes:
 * - Name (String)
 * - Subtitle (String)
 * - Location (String)
 * - Description (String)
 * - startDate (DateTime)
 * - endDate (DateTime)
 * - Mode (EventMode)
 * - Status (EventStatus)
 * @returns promise with event or error.
 */
const createEvent = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']

  try {
    const newEvent = await prisma.event.create({
      data: {
        ...req.body,
        owner:{
          connect:{
            id: req.params.userID,
        }
      }
      },
    });

    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes specified event by eventID.
 * @returns promise with eventID or error.
 */
const deleteEvent = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    const eventID = req.params.eventID;

    const eventEnrollment = await prisma.eventEnrollment.findFirst({
      where: {
        eventId: eventID,
      },
    })

    Promise.all([
      eventEnrollment && await prisma.eventEnrollment.delete({
        where: {
          eventId: eventID,
        },
      }),
      await prisma.event.delete({
        where: {
          id: eventID,
        },
      })
    ])
    res.status(200).json(eventID);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all events in DB
 * @returns promise with all events or error
 */
const getEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message;
    res.status(500).json({ result });
  }
};

/**
 * Updates an event with information specified in the request body.
 * Request body includes:
 * - Name (String)
 * - Subtitle (String)
 * - Location (String)
 * - Description (String)
 * - startDate (DateTime)
 * - endDate (DateTime)
 * - Mode (EventMode)
 * - Status (EventStatus)
 * @returns promise with eventID or error.
 */
const updateEvent = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    const eventID = req.params.eventID;

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventID,
      },
      data: {
        ...req.body,
      },
    });

    res.status(200).json(updatedEvent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all events with a start date after Date.now()
 * @returns promise with all events or error
 */
const getUpcomingEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const dateTime = new Date();
  try {
    const events = await prisma.event.findMany({
      where: {
        startDate: {
          gt: dateTime,
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message;
    res.status(500).json({ result });
  }
};

/**
 * Get all events with a start date before Date.now() and an end date
 * after Date.now()
 * @returns promise with all events or error
 */
const getCurrentEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const dateTime = new Date();
  try {
    const events = await prisma.event.findMany({
      where: {
        startDate: {
          lt: dateTime,
        },
        endDate: {
          gt: dateTime,
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message;
    res.status(500).json({ result });
  }
};

/**
 * Get all events all events with an end date before Date.now()
 * @returns promise with all events or error
 */
const getPastEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const dateTime = new Date();
  try {
    const events = await prisma.event.findMany({
      where: {
        endDate: {
          lt: dateTime,
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message;
    res.status(500).json({ result });
  }
};


/**
 * Get all event info by eventID
 * @returns promise with all event info or error
 */
const getEvent = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    const eventID = req.params.eventID;

    const event = await prisma.event.findUnique({
      where: {
        id: eventID,
      }
    });
    res.status(200).json(event);
  } catch (error) {
    const result = (error as Error).message;
    res.status(500).json({ result });
  }
};

const deleteAttendee = async (req: Request, res: Response) => {

}


export default {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
  getUpcomingEvents,
  getCurrentEvents,
  getPastEvents,
  deleteAttendee
};
