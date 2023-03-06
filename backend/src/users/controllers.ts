import { Prisma, userRole, UserStatus } from "@prisma/client";
import { Request, Response } from "express";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";

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
 * 
 */
const getSearchedUser = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const query = req.query;
    console.log("query: " + JSON.stringify(req.query));
    console.log("email: " + query.email);
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

    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllUsers,
  getSearchedUser
};
