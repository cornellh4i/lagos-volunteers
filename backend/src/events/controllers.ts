import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Get all events in DB
 * @returns promise with all events or error
 */
const getEvents = async (req: Request, res: Response) => {
  try {
    const events= await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get all events with a start date after Date.now()
 * @returns promise with all events or error
 */
const getUpcomingEvents = async (req: Request, res: Response) => {
  let dateTime = new Date()
  try {
    const events= await prisma.event.findMany({
      where: {
        startDate: {
          gt: dateTime,
        },
      },
    });
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get all events with a start date before Date.now() and an end date 
 * after Date.now()
 * @returns promise with all events or error
 */
const getCurrentEvents = async (req: Request, res: Response) => {
  let dateTime = new Date()
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
  } catch (error:any){
    res.status(500).json({error: error.message});
  }
}

/**
 * Get all events all events with an end date before Date.now()
 * @returns promise with all events or error
 */
const getPastEvents = async (req: Request, res: Response) => {
  let dateTime = new Date()
  try {
    const events=await prisma.event.findMany({
      where:{
        endDate:{
          lt: dateTime
        },
      },
    });
    res.status(200).json(events);
  } catch (error:any){
    res.status(500).json({error: error.message});
  }
}

export default {
  getEvents,
  getUpcomingEvents,
  getCurrentEvents,
  getPastEvents
};
