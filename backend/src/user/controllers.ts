import { Request, Response } from "express";
import prisma from "../../client";

/**
 * Creates a new user with information specified in the request body.
 * Request body includes:
 * - Email (String)
 * - Role (userRole) 
 * - Profile (Profile)
 * - Verified (Boolean)
 * - Hours (Int)
 * - Status (UserStatus)
 * - Created Events (Event[])
 * - Events (EventEnrollment[])
 * - Preferences (UserPreferences)
 * - Permissions (Permission[])
 * @returns promise with user or error.
 */
const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
      },
    })

    res.status(200).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes specified user by userID.
 * @returns promise with userID or error.
 */
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userID = req.params.userID

    const deleteUser = await prisma.user.delete({
      where: {
        id: userID,
      },
    });
    res.status(200).json(userID);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates a user with information specified in the request body. 
 * Request body includes:
 * - Email (String)
 * - Role (userRole) 
 * - Profile (Profile)
 * - Verified (Boolean)
 * - Hours (Int)
 * - Status (UserStatus)
 * - Created Events (Event[])
 * - Events (EventEnrollment[])
 * - Preferences (UserPreferences)
 * - Permissions (Permission[])
 * @returns promise with userID or error.
 */
const updateUser = async (req: Request, res: Response) => {
  try {
    const userID = req.params.userID

    const updatedUser = await prisma.user.update({
      where: {
        id: userID
      },
      data: {
        ...req.body,
      },
    })

    res.status(200).json(userID);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createUser,
  deleteUser,
  updateUser

};
