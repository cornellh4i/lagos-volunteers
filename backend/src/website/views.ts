import { Router, RequestHandler, Request, Response } from "express";
import websiteController from "./controllers";
import {
  auth,
  setVolunteerCustomClaims,
  NoAuth,
  authIfAdmin,
} from "../middleware/auth";
import { attempt } from "../utils/helpers";
const websiteRouter = Router();

let useAuth: RequestHandler;
let useAdminAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? ((useAuth = NoAuth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler))
  : ((useAuth = auth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler));
websiteRouter.get(
  "/download",
  useAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Website']
    attempt(res, 200, () => websiteController.downloadAllWebsiteData());
  }
);

export default websiteRouter;
