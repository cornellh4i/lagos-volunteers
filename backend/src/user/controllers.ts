import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../client";

/**
 * Creates a new user with all information specified in the JSON body 
 * @returns promise with userID or error
 */
const createUser = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    // Do we need to log the error?
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUser
};
