import { Request, Response, query } from "express";
import { Prisma, userRole, UserStatus } from "@prisma/client";
import {
  User,
  Profile,
  Permission,
  UserPreferences,
  EnrollmentStatus,
} from "@prisma/client";
import admin from "firebase-admin";
// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";
import { setVolunteerCustomClaims } from "../middleware/auth";

/**
 * Creates a new user
 * Parameters include - all types are of prisma types declared in the schema:
 * @param user : User (includes information such as email etc)
 * @param profile : Profile (includes information such as first name, last name, etc) optional
 * @param preferences : UserPreferences (includes information such as email preferences, etc) optional
 * @param permissions : Permission (includes information about user permissions, etc) optional
 * @returns promise with user or error.
 */
const createUser = async (
  user: User,
  profile?: Profile,
  preferences?: UserPreferences,
  permissions?: Permission
) => {
  return prisma.user.create({
    data: {
      ...user,
      profile: {
        create: {
          ...profile,
        },
      },
      preferences: {
        create: {
          ...preferences,
        },
      },
      permissions: {
        create: {
          ...permissions,
        },
      },
    },
  });
};

/**
 * Updates a user information
 * Parameter:
 * @param id: id of user to be updated
 * @param user: User information to be updated
 * @returns promise with userID or error.
 */
const updateUser = async (userID: string, user: User) => {
  return prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      ...user,
    },
  });
};
/**
 * Gets all Users in database and all data associated with each user
 * @returns promise with all users or error
 */
const getCountUsers = async () => {
  return prisma.user.count({});
};

/**
 * Gets all users in database and all data associated with each user
 * @param filter are the filter params passed in
 * @param sort are sort params passed in
 * @param pagination are the pagination params passed in
 * @returns promise with list of users
 */
const getUsers = async (
  filter: {
    firstName?: string;
    lastName?: string;
    nickname?: string;
    email?: string;
    role?: userRole;
    hours?: number;
    status?: UserStatus;
    eventId?: string;
    attendeeStatus?: EnrollmentStatus;
  },
  sort: {
    key: string;
    order: Prisma.SortOrder;
  },
  pagination: {
    after: string;
    limit: string;
  }
) => {
  /* SORTING */

  // Handles GET /users?sort=firstName:asc
  const defaultCursor = { id: "asc" };
  const sortDict: { [key: string]: any } = {
    default: { id: sort.order },
    email: [{ email: sort.order }, defaultCursor],
    hours: [{ hours: sort.order }, defaultCursor],
    firstName: [
      {
        profile: {
          firstName: sort.order,
        },
      },
      defaultCursor,
    ],
    lastName: [
      {
        profile: {
          lastName: sort.order,
        },
      },
      defaultCursor,
    ],
  };

  /* PAGINATION */

  // Handles GET /users?limit=20&after=asdf
  let cursor = undefined;
  let skip = undefined;
  if (pagination.after) {
    cursor = {
      id: pagination.after as string,
    };
    skip = 1;
  }
  let take = undefined;
  if (pagination.limit) {
    take = parseInt(pagination.limit as string);
  } else {
    // default limit
    take = 10;
  }

  /* FILTERING */

  // Handles GET /events?eventid=asdf
  const eventId = filter.eventId;
  const attendeeStatus = filter.attendeeStatus;
  console.log(attendeeStatus);
  let events: { [key: string]: any } = {};
  if (eventId && attendeeStatus) {
    events = {
      some: {
        attendeeStatus: attendeeStatus,
        eventId: eventId,
      },
    };
  }

  // Handles all other filtering
  let whereDict = {
    events: events,
    email: Array.isArray(filter.email) ? { in: filter.email } : filter.email,
    role: {
      equals: filter.role,
    },
    hours: filter.hours,
    status: {
      equals: filter.status,
    },
    profile: {
      firstName: Array.isArray(filter.firstName)
        ? { in: filter.firstName }
        : filter.firstName,
      lastName: Array.isArray(filter.lastName)
        ? { in: filter.lastName }
        : filter.lastName,
      nickname: Array.isArray(filter.nickname)
        ? { in: filter.nickname }
        : filter.nickname,
    },
  };

  /* RESULT */

  // Find the total number of records before pagination is applied
  const totalRecords = await prisma.user.count({
    where: {
      AND: [whereDict],
    },
  });

  const queryResult = await prisma.user.findMany({
    where: {
      AND: [whereDict],
    },
    include: {
      profile: true,
      events: eventId
        ? {
            where: {
              eventId: eventId,
            },
          }
        : {},
    },
    orderBy: sortDict[sort.key],
    take: take,
    skip: skip,
    cursor: cursor,
  });
  const lastPostInResults = take
    ? queryResult[take - 1]
    : queryResult[queryResult.length - 1];
  const myCursor = lastPostInResults ? lastPostInResults.id : undefined;
  return { result: queryResult, cursor: myCursor, totalItems: totalRecords };
};

/**
 * Gets all Users in database with pagination
 * @param req: Request paramters to get query used for pagination
 * @returns promise with all users or error
 */
const getUsersPaginated = async (req: Request) => {
  const query = req.query;
  // if no after is supplied make the request independent of that paramter
  return query.after === undefined
    ? prisma.user.findMany({
        take: query.limit ? parseInt(query.limit as string) : 10,
        orderBy: {
          id: "asc",
        },
        include: {
          profile: true,
        },
      })
    : prisma.user.findMany({
        take: query.limit ? parseInt(query.limit as string) : 10,
        cursor: {
          id: query.after ? (query.after as string) : undefined,
        },
        orderBy: {
          id: "asc",
        },
        include: {
          profile: true,
        },
      });
};

/**
 * returns promise with list of all users where [option] is [value], or.
 * [option] corresponds to the columns in the User table.
 * Search supports multiple queries
 * The following options are supported:
 * @param email user email
 * @param role role of type userRole - ADMIN, SUPERVISOR or VOLUNTEER
 * @param firstName first name of user
 * @param lastName last name of user
 * @param nickname nickname of user
 * @param hours hours of user
 * @param status status of user
 * @param req: Request paramters to get query used for search
 */
const getSearchedUser = async (
  req: Request,
  email?: string | string[],
  role?: userRole,
  firstName?: string,
  lastName?: string,
  nickname?: string,
  hours?: number,
  status?: UserStatus
) => {
  const query = req.query;
  return prisma.user.findMany({
    where: {
      AND: [
        {
          email: Array.isArray(query.email) ? { in: query.email } : query.email,
          role: {
            equals: query.role as userRole,
          },
          hours: query.hours ? parseInt(query.hours as any) : undefined,
          status: {
            equals: query.status as UserStatus,
          },
          profile: {
            firstName: Array.isArray(query.firstName)
              ? { in: query.firstName }
              : query.firstName,
            lastName: Array.isArray(query.lastName)
              ? { in: query.lastName }
              : query.lastName,
            nickname: Array.isArray(query.nickname)
              ? { in: query.nickname }
              : query.nickname,
          },
        },
      ],
    },
    include: {
      profile: true,
    },
  });
};

/**
 * Gets user by userID in database and all data associated with user
 * @param userID: id of user to be retrieved
 * @returns promise with user or error
 */
const getUserByID = async (userID: string) => {
  return prisma.user.findUnique({
    where: {
      id: userID,
    },
    include: {
      profile: true,
    },
  });
};

/**
 * Gets all events created by the requested user in the database.
 * @param userID: id of user to be retrieved
 * @returns promise with Array of Event[] or error
 */
const getCreatedEvents = async (userID: string) => {
  return prisma.user.findUnique({
    where: {
      id: userID,
    },
    include: {
      createdEvents: true,
    },
  });
};

/**
 * Gets all events the requested user is registered for in the database.
 * @param userID: id of user to be retrieved
 * @param eventID: id of event to be retrieved
 * @returns promise with event or error
 */
const getRegisteredEvents = async (userID: string, eventID: string) => {
  // First check attendance record for this event
  if (eventID) {
    const attendance = await prisma.eventEnrollment.findFirst({
      where: {
        userId: userID,
        eventId: eventID,
      },
    });

    const eventDetails = await prisma.event.findUnique({
      where: {
        id: eventID,
      },
      include: {
        owner: {
          select: {
            profile: true,
          },
        },
      },
    });

    return { attendance, eventDetails };
  }

  return prisma.user.findUnique({
    where: {
      id: userID,
    },
    include: {
      events: {
        select: {
          event: true,
        },
      },
    },
  });
};

/**
 * Gets number of hours the requested user has completed in the database.
 * @returns promise with Int or error
 */
const getHours = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      hours: true,
    },
  });
};

/**
 * Gets the specified user's profile
 * @param userid
 * @returns the specified user's profile
 */
const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });
};

/**
 * Updates a user profile
 * - Profile (Profile)
 * @param userId: id of user to be updated
 * @returns promise with updated user or error.
 */
const editProfile = async (userId: string, profile: Profile) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        update: {
          ...profile,
        },
      },
    },
    include: {
      profile: true,
    },
  });
};

/**
 * Gets the specified user's role
 * @param userId user id
 * @returns the specified user's role
 */
const getUserRole = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });
};

/**
 * Gets the specified user's preferences
 * @param userid user id
 * @returns the specified user's preferences
 */
const getUserPreferences = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      preferences: true,
    },
  });
};

/**
 * Updates a user preferences
 * @param Preferences (UserPreferences)
 * @param userId: id of user to be updated
 * @returns promise with updated user or error.
 */
const editPreferences = async (
  userId: string,
  preferences: UserPreferences
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      preferences: {
        update: {
          ...preferences,
        },
      },
    },
    include: {
      preferences: true,
    },
  });
};

/**
 * Updates a user's status
 * @param status: status of type UserStatus - ACTIVE, INACTIVE, SUSPENDED
 * @param userid: id of user to be updated
 * @returns promise with user or error
 */
const editStatus = async (userId: string, status: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: status as UserStatus,
    },
  });
};

/**
 * Updates a user's role
 * @param role: role of type userRole - ADMIN, SUPERVISOR, VOLUNTEER
 * @param userid: id of user to be updated
 * @returns promise with user or error
 */
const editRole = async (userId: string, role: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role as userRole,
    },
  });
};

/**
 * Updates a user's hours
 * @param hours: hours of type number
 * @param userid: id of user to be updated
 * @returns promise with user or error
 */
const editHours = async (userId: string, hours: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hours: parseInt(hours),
    },
  });
};

/**
 * Returns sorted Users based on one key
 * @param req: Request parameter
 * @returns promise with user or error
 */
const getUsersSorted = async (req: Request) => {
  const query = req.query.sort as string;
  const querySplit = query.split(":");
  const key: string = querySplit[0];
  const order = querySplit[1] as Prisma.SortOrder;

  if (key == "email") {
    return prisma.user.findMany({
      orderBy: [{ email: order }],
    });
  } else if (key == "hours") {
    return prisma.user.findMany({
      orderBy: [{ hours: order }],
    });
  } else if (key == "firstName") {
    return prisma.user.findMany({
      orderBy: {
        profile: {
          firstName: order,
        },
      },
      include: {
        profile: true,
      },
    });
  } else if (key == "lastName") {
    return prisma.user.findMany({
      orderBy: {
        profile: {
          lastName: order,
        },
      },
      include: {
        profile: true,
      },
    });
  }
};

/**
 * Deletes specified user by userID.
 * @param userId: id of user to be deleted
 * @returns promise with userID or error.
 * Deleting a user is little bit tricky because we have to delete all the records. Check back to this
 */
const deleteUser = async (userID: string) => {
  return prisma.user.delete({
    where: {
      id: userID,
    },
  });
};

export default {
  createUser,
  deleteUser,
  updateUser,
  getCountUsers,
  getUsers,
  getUsersPaginated,
  getSearchedUser,
  getUserByID,
  getCreatedEvents,
  getRegisteredEvents,
  getHours,
  getUserProfile,
  getUserRole,
  getUserPreferences,
  editProfile,
  editPreferences,
  editStatus,
  editRole,
  editHours,
  getUsersSorted,
};
