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
const express_1 = require("express");
const controllers_1 = __importDefault(require("./controllers"));
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../utils/helpers");
const eventRouter = (0, express_1.Router)();
// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
    eventRouter.use(auth_1.auth);
}
eventRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    const eventDTO = req.body;
    (0, helpers_1.attempt)(res, 201, () => controllers_1.default.createEvent(eventDTO));
}));
eventRouter.put("/:eventid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.updateEvent(req.params.eventid, req.body));
}));
eventRouter.delete("/:eventid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.deleteEvent(req.params.eventid));
}));
eventRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    const filter = {
        date: req.query.date,
        ownerId: req.query.ownerid,
        userId: req.query.userid,
    };
    const sortQuery = req.query.sort;
    const querySplit = sortQuery ? sortQuery.split(":") : ["default", "asc"];
    const key = querySplit[0];
    const order = querySplit[1];
    const sort = {
        key: key,
        order: order,
    };
    const pagination = {
        after: req.query.after,
        limit: req.query.limit,
    };
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getEvents(filter, sort, pagination));
}));
eventRouter.get("/upcoming", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, controllers_1.default.getUpcomingEvents);
}));
eventRouter.get("/current", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, controllers_1.default.getCurrentEvents);
}));
eventRouter.get("/past", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, controllers_1.default.getPastEvents);
}));
eventRouter.get("/:eventid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getEvent(req.params.eventid));
}));
eventRouter.get("/:eventid/attendees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getAttendees(req.params.eventid, req.query.userid));
}));
eventRouter.post("/:eventid/attendees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    const { attendeeid } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.addAttendee(req.params.eventid, attendeeid));
}));
eventRouter.put("/:eventid/attendees", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    const { attendeeid, cancelationMessage } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.deleteAttendee(req.params.eventid, attendeeid, cancelationMessage));
}));
eventRouter.patch("/:eventid/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    const { status } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.updateEventStatus(req.params.eventid, status));
}));
eventRouter.patch("/:eventid/owner", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    const { ownerid } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.updateEventOwner(req.params.eventid, ownerid));
}));
eventRouter.patch("/:eventid/attendees/:attendeeid/confirm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Events']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.confirmUser(req.params.eventid, req.params.attendeeid));
}));
exports.default = eventRouter;
