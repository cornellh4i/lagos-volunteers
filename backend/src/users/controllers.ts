import { Prisma } from "@prisma/client";
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
    console.log("query: " + JSON.stringify(query));
    const users = await prisma.user.findMany({
      where: {
        AND: [
          query,
          { //what some do idk 
            email: query.email != null ? query.email : undefined,
            role: query.role != null ? query.role : undefined,
            hours: query.hours != null ? query.hours : undefined,
            status: query.status != null ? query.status : undefined,
            profile: {
              // some: { //what some do idk 
              firstName: query.firstName != null ? query.firstName : undefined,
              lastName: query.lastName != null ? query.lastName : undefined,
              nickname: query.nickname != null ? query.nickname : undefined,
            }
            // }
          }
        ],
      }

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
