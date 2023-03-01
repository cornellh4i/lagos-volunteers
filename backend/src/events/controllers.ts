import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Finds all users in DB
 * @returns promise with all users or error
 */

// Returns all events in the database
const getEvents = async (req: Request, res: Response) => {
  try {
    const events= await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

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
