import { Router, RequestHandler, Request, Response } from "express";
import {
  auth,
  NoAuth,
  authIfAdmin,
  authIfSupervisor,
  authIfVolunteer,
} from "../middleware/auth";
import { attempt } from "../utils/helpers";
import aboutController from "./controllers";

const aboutRouter = Router();

let useAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? (useAuth = NoAuth as RequestHandler)
  : (useAuth = auth as RequestHandler);

aboutRouter.get(
  "/",
  (authIfAdmin as RequestHandler) ||
    (authIfSupervisor as RequestHandler) ||
    (authIfVolunteer as RequestHandler),
  async (req: Request, res: Response) => {
    attempt(res, 200, () => aboutController.getAboutPageContent());
  }
);

aboutRouter.patch(
  "/:pageid",
  authIfAdmin as RequestHandler,
  async (req: Request, res: Response) => {
    const { newContent } = req.body;
    attempt(res, 200, () =>
      aboutController.updateAboutPageContent(req.params.pageid, newContent)
    );
  }
);

export default aboutRouter;
