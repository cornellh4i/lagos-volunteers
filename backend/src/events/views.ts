import { Router } from "express";
import eventController from "./controllers";

const eventRouter = Router();

/** Event Specific Routes */

eventRouter.get("/all", eventController.getEvents);
eventRouter.get("/upcoming", eventController.getUpcomingEvents);
eventRouter.get("/current", eventController.getCurrentEvents);
eventRouter.get("/past", eventController.getPastEvents);

export default eventRouter;
