import { Router, RequestHandler, Request, Response } from "express";
import {
  auth,
  NoAuth,
  authIfAdmin,
  authIfSupervisor,
} from "../middleware/auth";
import { attempt } from "../utils/helpers";
import aboutController from "./controllers";

const aboutRouter = Router();

let useAuth: RequestHandler;
let useAdminAuth: RequestHandler;
let useSuperAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? ((useAuth = NoAuth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler),
    (useSuperAuth = authIfSupervisor as RequestHandler))
  : ((useAuth = auth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler),
    (useSuperAuth = authIfSupervisor as RequestHandler));

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
