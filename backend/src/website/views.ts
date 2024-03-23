import { Router, RequestHandler, Request, Response } from "express";
import { Prisma, userRole, UserStatus } from "@prisma/client";
import websiteController from "./controllers";
import { auth, setVolunteerCustomClaims, NoAuth } from "../middleware/auth";
const userRouter = Router();
import * as firebase from "firebase-admin";

import { attempt } from "../utils/helpers";

let useAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? (useAuth = NoAuth as RequestHandler)
  : (useAuth = auth as RequestHandler);

userRouter.get("/export/event", useAuth, async (req: Request, res: Response) => {
  attempt(res, 200, () => {
    const events = websiteController.getAllEvents();
    console.log(events)
    return events
  });
});

export default userRouter;