import { Router, RequestHandler } from "express";
import eventController from "./controllers";
import { auth } from "../middleware/auth"

const eventRouter = Router();

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== 'test') {
  eventRouter.use(auth as RequestHandler);
}

/** Event Specific Routes */
eventRouter.get("/", eventController.getEvents);
eventRouter.get("/upcoming", eventController.getUpcomingEvents);
eventRouter.get("/current", eventController.getCurrentEvents);
eventRouter.get("/past", eventController.getPastEvents);

export default eventRouter;
