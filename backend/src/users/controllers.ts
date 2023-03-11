import { Request, Response } from "express";
import { userRole, UserStatus } from "@prisma/client";

// We are using one connection to prisma client to prevent multiple connections
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

    res.status(201).json(newUser);
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

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
      include: {
        profile: true
      }

    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**Updates a user profile with information specified in the request body. 
* Request body includes:
* - Profile (Profile)
* @returns promise with userID or error.
*/

const editProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  const userID = req.params.userID
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.body));
  //DELETE LATER: test id 
  // cleuf7ta70000un78em3cb1wj
  /**
   * 
   * {
            "firstName": "A",
            "lastName": "Smith",
            "nickname": "Asmithy",
            "imageURL": null,
            "disciplinaryNotices": 0,
            "userId": "cleuf7ta70000un78em3cb1wj"
        }
   */
  console.log(req.params);

  try {
    const users = await prisma.user.update({
      where: { id: userID },
      data: {
        profile: {
          ...req.body, //do they need to input all fields if they want to update just one? 
        }
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * 
 */
const editPreferences = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * 
 */
const editStatus = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  const userID = req.params.userID
  const status = req.params.status
  console.log(JSON.stringify(req.params));
  try {
    const users = await prisma.user.update({
      where: {
        id: userID
      },
      data: {
        status: status as UserStatus
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * 
 */
const editRole = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * 
 */
const editHours = async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}



export default {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getSearchedUser,
  editProfile,
  editPreferences,
  editStatus,
  editRole,
  editHours
};
