"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// We are using one connection to prisma client to prevent multiple connections
const client_1 = __importDefault(require("../../client"));
/**
 * Creates a new user
 * Parameters include - all types are of prisma types declared in the schema:
 * @param user : User (includes information such as email etc)
 * @param profile : Profile (includes information such as first name, last name, etc) optional
 * @param preferences : UserPreferences (includes information such as email preferences, etc) optional
 * @param permissions : Permission (includes information about user permissions, etc) optional
 * @returns promise with user or error.
 */
const createUser = (user, profile, preferences, permissions) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.create({
        data: Object.assign(Object.assign({}, user), { profile: {
                create: Object.assign({}, profile),
            }, preferences: {
                create: Object.assign({}, preferences),
            }, permissions: {
                create: Object.assign({}, permissions),
            } }),
    });
});
/**
 * Updates a user information
 * Parameter:
 * @param id: id of user to be updated
 * @param user: User information to be updated
 * @returns promise with userID or error.
 */
const updateUser = (userID, user) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: {
            id: userID,
        },
        data: Object.assign({}, user),
    });
});
/**
 * Gets all Users in database and all data associated with each user
 * @returns promise with all users or error
 */
const getCountUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.count({});
});
/**
 * Gets all users in database and all data associated with each user
 * @param filter are the filter params passed in
 * @param sort are sort params passed in
 * @param pagination are the pagination params passed in
 * @returns promise with list of users
 */
const getUsers = (filter, sort, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    /* SORTING */
    // Handles GET /users?sort=firstName:asc
    const defaultCursor = { id: "asc" };
    const sortDict = {
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
            id: pagination.after,
        };
        skip = 1;
    }
    let take = undefined;
    if (pagination.limit) {
        take = parseInt(pagination.limit);
    }
    else {
        // default limit
        take = 10;
    }
    /* FILTERING */
    // Handles GET /events?eventid=asdf
    const eventId = filter.eventId;
    let events = {};
    if (eventId) {
        events = {
            some: {
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
    const totalRecords = yield client_1.default.user.count({
        where: {
            AND: [whereDict],
        },
    });
    const queryResult = yield client_1.default.user.findMany({
        where: {
            AND: [whereDict],
        },
        include: {
            profile: true,
            events: eventId ? true : false,
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
});
/**
 * Gets all Users in database with pagination
 * @param req: Request paramters to get query used for pagination
 * @returns promise with all users or error
 */
const getUsersPaginated = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    // if no after is supplied make the request independent of that paramter
    return query.after === undefined
        ? client_1.default.user.findMany({
            take: query.limit ? parseInt(query.limit) : 10,
            orderBy: {
                id: "asc",
            },
            include: {
                profile: true,
            },
        })
        : client_1.default.user.findMany({
            take: query.limit ? parseInt(query.limit) : 10,
            cursor: {
                id: query.after ? query.after : undefined,
            },
            orderBy: {
                id: "asc",
            },
            include: {
                profile: true,
            },
        });
});
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
const getSearchedUser = (req, email, role, firstName, lastName, nickname, hours, status) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    return client_1.default.user.findMany({
        where: {
            AND: [
                {
                    email: Array.isArray(query.email) ? { in: query.email } : query.email,
                    role: {
                        equals: query.role,
                    },
                    hours: query.hours ? parseInt(query.hours) : undefined,
                    status: {
                        equals: query.status,
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
});
/**
 * Gets user by userID in database and all data associated with user
 * @param userID: id of user to be retrieved
 * @returns promise with user or error
 */
const getUserByID = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: {
            id: userID,
        },
    });
});
/**
 * Gets all events created by the requested user in the database.
 * @param userID: id of user to be retrieved
 * @returns promise with Array of Event[] or error
 */
const getCreatedEvents = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: {
            id: userID,
        },
        include: {
            createdEvents: true,
        },
    });
});
/**
 * Gets all events the requested user is registered for in the database.
 * @param userID: id of user to be retrieved
 * @param eventID: id of event to be retrieved
 * @returns promise with event or error
 */
const getRegisteredEvents = (userID, eventID) => __awaiter(void 0, void 0, void 0, function* () {
    // First check attendance record for this event
    if (eventID) {
        const attendance = yield client_1.default.eventEnrollment.findFirst({
            where: {
                userId: userID,
                eventId: eventID,
            },
        });
        const eventDetails = yield client_1.default.event.findUnique({
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
    return client_1.default.user.findUnique({
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
});
/**
 * Gets number of hours the requested user has completed in the database.
 * @returns promise with Int or error
 */
const getHours = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            hours: true,
        },
    });
});
/**
 * Gets the specified user's profile
 * @param userid
 * @returns the specified user's profile
 */
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            profile: true,
        },
    });
});
/**
 * Updates a user profile
 * - Profile (Profile)
 * @param userId: id of user to be updated
 * @returns promise with updated user or error.
 */
const editProfile = (userId, profile) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: { id: userId },
        data: {
            profile: {
                update: Object.assign({}, profile),
            },
        },
        include: {
            profile: true,
        },
    });
});
/**
 * Gets the specified user's role
 * @param userId user id
 * @returns the specified user's role
 */
const getUserRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
        },
    });
});
/**
 * Gets the specified user's preferences
 * @param userid user id
 * @returns the specified user's preferences
 */
const getUserPreferences = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            preferences: true,
        },
    });
});
/**
 * Updates a user preferences
 * @param Preferences (UserPreferences)
 * @param userId: id of user to be updated
 * @returns promise with updated user or error.
 */
const editPreferences = (userId, preferences) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: { id: userId },
        data: {
            preferences: {
                update: Object.assign({}, preferences),
            },
        },
        include: {
            preferences: true,
        },
    });
});
/**
 * Updates a user's status
 * @param status: status of type UserStatus - ACTIVE, INACTIVE, SUSPENDED
 * @param userid: id of user to be updated
 * @returns promise with user or error
 */
const editStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            status: status,
        },
    });
});
/**
 * Updates a user's role
 * @param role: role of type userRole - ADMIN, SUPERVISOR, VOLUNTEER
 * @param userid: id of user to be updated
 * @returns promise with user or error
 */
const editRole = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            role: role,
        },
    });
});
/**
 * Updates a user's hours
 * @param hours: hours of type number
 * @param userid: id of user to be updated
 * @returns promise with user or error
 */
const editHours = (userId, hours) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            hours: parseInt(hours),
        },
    });
});
/**
 * Returns sorted Users based on one key
 * @param req: Request parameter
 * @returns promise with user or error
 */
const getUsersSorted = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.sort;
    const querySplit = query.split(":");
    const key = querySplit[0];
    const order = querySplit[1];
    if (key == "email") {
        return client_1.default.user.findMany({
            orderBy: [{ email: order }],
        });
    }
    else if (key == "hours") {
        return client_1.default.user.findMany({
            orderBy: [{ hours: order }],
        });
    }
    else if (key == "firstName") {
        return client_1.default.user.findMany({
            orderBy: {
                profile: {
                    firstName: order,
                },
            },
            include: {
                profile: true,
            },
        });
    }
    else if (key == "lastName") {
        return client_1.default.user.findMany({
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
});
/**
 * Deletes specified user by userID.
 * @param userId: id of user to be deleted
 * @returns promise with userID or error.
 * Deleting a user is little bit tricky because we have to delete all the records. Check back to this
 */
const deleteUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.user.delete({
        where: {
            id: userID,
        },
    });
});
exports.default = {
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
