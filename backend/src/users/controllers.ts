import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Finds all users in DB
 * @returns promise with all users or error
 */
const getUsers = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Sign up a new user. User details are passed in request body.
 * Request body includes:
 * - email (string)
 * - name (string)
 * @returns promise with user or error
 */
const createNewUser = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const result = await prisma.user.create({
      data: {
        ...req.body,
      },
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Gets all Users in database and all data associated with each user
 * @returns promise with all users or error
 * 
 * 
 */

const getAllUsers = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
/**
 * returns a list of all users where [option] is [value]. [option] corresponds to the columns in the User table. 
 * @query option the column on the User table
 * @query value the value we are searching for given the option? 
 * @returns promise with user list or error
 * 
 */
const getSearchedUser = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const option = req.query.option;
    const value = req.query.value;
    console.log("option: " + option);
    console.log("value: " + value);
    const users = await prisma.user.findMany({
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getUsers,
  createNewUser,
  getAllUsers,
  getSearchedUser
};
