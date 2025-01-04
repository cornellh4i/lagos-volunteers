import { Router, RequestHandler, Request, Response } from "express";
import {
  auth,
  NoAuth,
  authIfAdmin,
  authIfSupervisorOrAdmin,
} from "../middleware/auth";
import { attempt } from "../utils/helpers";
import aboutController from "./controllers";

const aboutRouter = Router();

let useAuth: RequestHandler;
let useAdminAuth: RequestHandler;
let useSupervisorAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? ((useAuth = NoAuth as RequestHandler),
    (useAdminAuth = NoAuth as RequestHandler),
    (useSupervisorAuth = NoAuth as RequestHandler))
  : ((useAuth = auth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler),
    (useSupervisorAuth = authIfSupervisorOrAdmin as RequestHandler));

aboutRouter.get("/", useAuth, async (req: Request, res: Response) => {
  attempt(res, 200, () => aboutController.getAboutPageContent());
});

aboutRouter.patch(
  "/:pageid",
  useAdminAuth,
  async (req: Request, res: Response) => {
    const { newContent } = req.body;
    attempt(res, 200, () =>
      aboutController.updateAboutPageContent(req.params.pageid, newContent)
    );
  }
);

export default aboutRouter;
