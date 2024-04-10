import { Router, RequestHandler, Request, Response } from "express";
import websiteController from "./controllers";
import { auth, setVolunteerCustomClaims, NoAuth } from "../middleware/auth";
import { attempt } from "../utils/helpers";
const websiteRouter = Router();

let useAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? (useAuth = NoAuth as RequestHandler)
  : (useAuth = auth as RequestHandler);
  
websiteRouter.get("/download", useAuth, async (req: Request, res: Response) => {
  attempt(res, 200, () => websiteController.downloadAllWebsiteData());
}
);

export default websiteRouter;