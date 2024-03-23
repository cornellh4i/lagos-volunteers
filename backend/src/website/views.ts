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
  try {
    let events = await websiteController.getAllEvents()
    
  } catch{

  }
})

export default userRouter;