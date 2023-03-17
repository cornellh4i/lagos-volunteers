import { Router } from "express";
import eventController from "./controllers";

const eventRouter = Router();

/** Event Specific Routes */

eventRouter.post("/create/:userID", eventController.createEvent);
eventRouter.put("/:eventID", eventController.updateEvent);
eventRouter.delete("/delete/:eventID", eventController.deleteEvent);
eventRouter.get("/", eventController.getEvents);
eventRouter.get("/upcoming", eventController.getUpcomingEvents);
eventRouter.get("/current", eventController.getCurrentEvents);
eventRouter.get("/past", eventController.getPastEvents);

export default eventRouter;
