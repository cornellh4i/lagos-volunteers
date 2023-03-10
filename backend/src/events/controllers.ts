import { Request, Response } from "express";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Get all events in DB
 * @returns promise with all events or error
 */
const getEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    const events= await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message
    res.status(500).json({ result });
  }
}

/**
 * Get all events with a start date after Date.now()
 * @returns promise with all events or error
 */
const getUpcomingEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const dateTime = new Date()
  try {
    const events= await prisma.event.findMany({
      where: {
        startDate: {
          gt: dateTime,
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message
    res.status(500).json({ result });
  }
}

/**
 * Get all events with a start date before Date.now() and an end date 
 * after Date.now()
 * @returns promise with all events or error
 */
const getCurrentEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const dateTime = new Date()
  try {
    const events=await prisma.event.findMany({
      where:{
        startDate:{
          lt: dateTime
        },
        endDate:{
          gt: dateTime
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message
    res.status(500).json({ result });
  }
}

/**
 * Get all events all events with an end date before Date.now()
 * @returns promise with all events or error
 */
const getPastEvents = async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const dateTime = new Date()
  try {
    const events=await prisma.event.findMany({
      where:{
        endDate:{
          lt: dateTime
        },
      },
    });
    res.status(200).json(events);
  } catch (error) {
    const result = (error as Error).message
    res.status(500).json({ result });
  }
}

export default {
  getEvents,
  getUpcomingEvents,
  getCurrentEvents,
  getPastEvents
};
