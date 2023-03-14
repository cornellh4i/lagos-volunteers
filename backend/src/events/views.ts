import { Router } from "express";
import eventController from "./controllers";
import { auth } from "../middleware/auth"

const eventRouter = Router();

/** Event Specific Routes */
//@ts-ignore
eventRouter.get("/", auth, eventController.getEvents);
//@ts-ignore
eventRouter.get("/upcoming", auth, eventController.getUpcomingEvents);
//@ts-ignore
eventRouter.get("/current", auth, eventController.getCurrentEvents);
//@ts-ignore
eventRouter.get("/past", auth, eventController.getPastEvents);

export default eventRouter;
