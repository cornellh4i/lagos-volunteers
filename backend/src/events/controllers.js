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
const controllers_1 = __importDefault(require("../users/controllers"));
const client_1 = __importDefault(require("../../client"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
/**
 * Creates a new event and assign owner to it.
 * @param eventDTO contains the ownerID and the event body
 * @returns promise with event or error.
 */
const createEvent = (eventDTO) => __awaiter(void 0, void 0, void 0, function* () {
    // weird typescript error here with the prisma event type
    const { userID, event } = eventDTO;
    return client_1.default.event.create({
        data: Object.assign(Object.assign({}, event), { owner: {
                connect: {
                    id: userID,
                },
            } }),
    });
});
/**
 * Deletes specified event by eventID.
 * @param eventID (String)
 * @returns promise with eventID or error.
 */
const deleteEvent = (eventID) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.event.delete({
        where: {
            id: eventID,
        },
    });
});
/**
 * Search, sort and pagination for events
 * @param filter are the filter params passed in
 * @param sort are sort params passed in
 * @param pagination are the pagination params passed in
 * @returns promise with list of events
 */
const getEvents = (filter, sort, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    /* SORTING */
    // Handles GET /events?sort=location:desc
    const defaultCursor = { id: "asc" };
    const sortDict = {
        default: { id: sort.order },
        name: [{ name: sort.order }, defaultCursor],
        location: [{ location: sort.order }, defaultCursor],
        startDate: [{ startDate: sort.order }, defaultCursor],
    };
    /* PAGINATION */
    // Handles GET /events?limit=20&after=asdf
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
        // default take is 10
        take = 10;
    }
    /* FILTERING */
    let whereDict = {};
    let includeDict = {};
    // Handles GET /events?date=upcoming and GET /events?date=past
    // TODO: Investigate creating events that occur in a few minutes into the future
    const dateTime = new Date();
    switch (filter.date) {
        case "upcoming":
            // An event that has started but not ended is still considered upcoming
            whereDict["endDate"] = {
                gte: dateTime,
            };
            break;
        case "past":
            // An event is considered past if it has ended
            whereDict["endDate"] = {
                lt: dateTime,
            };
            break;
    }
    // Handles GET /events?ownerId=asdf
    if (filter.ownerId) {
        whereDict["ownerId"] = filter.ownerId;
    }
    // Handles GET /events?userId=asdf
    if (filter.userId) {
        whereDict["attendees"] = {
            some: {
                userId: filter.userId,
            },
        };
    }
    // Find the total number of records before pagination is applied
    const totalRecords = yield client_1.default.event.count({
        where: {
            AND: [whereDict],
        },
    });
    /* RESULT */
    const queryResult = yield client_1.default.event.findMany({
        where: {
            AND: [whereDict],
        },
        include: includeDict,
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
 * Updates an event
 * @param event (Event) event body
 * @param eventID (String)
 * @returns promise with eventID or error.
 */
const updateEvent = (eventID, event) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.event.update({
        where: {
            id: eventID,
        },
        data: Object.assign({}, event),
    });
});
/**
 * Get all events with a start date after Date.now()
 * @returns promise with all events or error
 */
const getUpcomingEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const dateTime = new Date();
    return client_1.default.event.findMany({
        where: {
            startDate: {
                gt: dateTime,
            },
        },
    });
});
/**
 * Get all events with a start date before Date.now() and an end date
 * after Date.now()
 * @returns promise with all events or error
 */
const getCurrentEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const dateTime = new Date();
    return client_1.default.event.findMany({
        where: {
            startDate: {
                lt: dateTime,
            },
            endDate: {
                gt: dateTime,
            },
        },
    });
});
/**
 * Get all events all events with an end date before Date.now()
 * @returns promise with all events or error
 */
const getPastEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const dateTime = new Date();
    return yield client_1.default.event.findMany({
        where: {
            endDate: {
                lt: dateTime,
            },
        },
    });
});
/**
 * Get all event info by eventID
 * @param eventID (String)
 * @returns promise with all event info or error
 */
const getEvent = (eventID) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.default.event.findUnique({
        where: {
            id: eventID,
        },
        include: {
            owner: {
                select: {
                    profile: true,
                },
            },
            tags: true,
        },
    });
});
/**
 * Gets all attendees registered for an event
 * @param eventID (String)
 * @param userID (String)
 * @returns promise with all attendees of the event or error
 */
const getAttendees = (eventID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    if (userID) {
        // If userID is provided, return only the attendee connected to the userID and eventID
        return client_1.default.eventEnrollment.findUnique({
            where: {
                userId_eventId: {
                    userId: userID,
                    eventId: eventID,
                },
            },
            include: {
                user: true,
                event: true,
            },
        });
    }
    // if userID is not provided, return all attendees of the event
    return client_1.default.eventEnrollment.findMany({
        where: {
            eventId: eventID,
        },
        include: {
            user: true,
        },
    });
});
/**
 * Adds specified user to an event
 * @param eventID (String)
 * @param attendeeID (String) id of user to add to event
 * @returns promise with user or error
 */
const addAttendee = (eventID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // grabs the user and their email for SendGrid fucntionality
    const user = yield controllers_1.default.getUserByID(userID);
    const userEmail = user === null || user === void 0 ? void 0 : user.email;
    // sets the email message
    const emailMsg = "USER WAS REGISTERED";
    if (process.env.NODE_ENV !== "test") {
        yield sendEmail(userEmail, emailMsg);
    }
    return yield client_1.default.eventEnrollment.create({
        data: {
            event: {
                connect: {
                    id: eventID,
                },
            },
            user: {
                connect: {
                    id: userID,
                },
            },
        },
    });
});
/**
 * Sends an email to the specified address
 * @param email is the email address to send to
 * @param message is the email body
 */
const sendEmail = (email, message) => __awaiter(void 0, void 0, void 0, function* () {
    // Create an email message
    const msg = {
        to: email,
        from: "lagosfoodbankdev@gmail.com",
        subject: "Your Email Subject",
        text: message, // You can use HTML content as well
    };
    // Send the email
    mail_1.default
        .send(msg)
        .then(() => {
        console.log("Email sent successfully");
    })
        .catch((error) => {
        console.error("Error sending email:", error);
    });
});
/**
 * Remove the specified user from the event
 * @param eventID (String)
 * @param userID (String) id of user to add to event
 * @returns promise with eventid or error
 */
const deleteAttendee = (eventID, userID, cancelationMessage) => __awaiter(void 0, void 0, void 0, function* () {
    // grabs the user and their email for SendGrid fucntionality
    const user = yield controllers_1.default.getUserByID(userID);
    var userEmail = user === null || user === void 0 ? void 0 : user.email;
    // sets the email message
    const emailMsg = "USER REMOVED FROM THIS EVENT";
    if (process.env.NODE_ENV != "test") {
        yield sendEmail(userEmail, emailMsg);
    }
    // update db
    return yield client_1.default.eventEnrollment.update({
        where: {
            userId_eventId: {
                userId: userID,
                eventId: eventID,
            },
        },
        data: {
            canceled: true,
            cancelationMessage: cancelationMessage,
        },
    });
});
/**
 * Update the event status
 * @param eventID (String)
 * @param status (String) new status of event
 * @returns promise with event or error
 */
const updateEventStatus = (eventID, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.event.update({
        where: {
            id: eventID,
        },
        data: {
            status: status,
        },
    });
});
/**
 * Update the event owner
 * @param eventID (String)
 * @param ownerID (String) id of owner
 * @returns promise with event or error
 */
const updateEventOwner = (eventID, ownerID) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.event.update({
        where: {
            id: eventID,
        },
        data: {
            ownerId: ownerID,
        },
    });
});
/**
 * Confirm the attendance of the specified user at the event
 * @param eventID (String)
 * @param userID (String) id of user
 * @returns promise with event or error
 */
const confirmUser = (eventID, userID) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.eventEnrollment.update({
        where: {
            userId_eventId: {
                userId: userID,
                eventId: eventID,
            },
        },
        data: {
            showedUp: true,
        },
    });
});
exports.default = {
    createEvent,
    deleteEvent,
    getEvents,
    updateEvent,
    getUpcomingEvents,
    getCurrentEvents,
    getPastEvents,
    getEvent,
    getAttendees,
    addAttendee,
    deleteAttendee,
    updateEventStatus,
    updateEventOwner,
    confirmUser,
};
