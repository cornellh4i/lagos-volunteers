import { Request, Response } from "express";
import { userRole, UserStatus } from "@prisma/client";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

/**
 * Sign up a new user. User details are passed in request body.
 * Request body includes:
 * - email (string)
 * @returns promise with user or error
 */
const createNewUser = async (req: Request, res: Response) => {
  // #swagger.tags = ['User']
  try {
    const result = await prisma.user.create({
      data: {
        ...req.body,
      },
      include:{
        profile: true,
      }
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
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
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
/**
 * returns promise with list of all users where [option] is [value], or. 
 * [option] corresponds to the columns in the User table. 
 * Search supports multiple queries 
 * The following options are supported: 
 * email
 * role
 * firstName
 * lastName
 * nickname
 * hours
 * status
 */
const getSearchedUser = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const query = req.query;

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            email: Array.isArray(query.email) ? { in: query.email } : query.email,
            role: {
              equals: query.role as userRole
            },
            hours: query.hours ? parseInt(query.hours as any) : undefined,
            status: {
              equals: query.status as UserStatus
            },
            profile: {
              firstName: Array.isArray(query.firstName) ? { in: query.firstName } : query.firstName,
              lastName: Array.isArray(query.lastName) ? { in: query.lastName } : query.lastName,
              nickname: Array.isArray(query.nickname) ? { in: query.nickname } : query.nickname,
            }
          }

        ],

      },
      include:{
        profile:true
      }

    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
};



export default {
  createNewUser,
  getAllUsers,
  getSearchedUser
};
