import { Router, RequestHandler, Request, Response } from "express";
import { auth, NoAuth } from "../middleware/auth";
import { attempt } from "../utils/helpers";
import aboutController from "./controllers";

const aboutRouter = Router();

let useAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? (useAuth = NoAuth as RequestHandler)
  : (useAuth = auth as RequestHandler);

aboutRouter.get("/", useAuth, async (req: Request, res: Response) => {
  attempt(res, 200, () => aboutController.getAboutPageContent());
});

aboutRouter.patch("/:pageid", useAuth, async (req: Request, res: Response) => {
  const { newContent } = req.body;
  attempt(res, 200, () => aboutController.updateAboutPageContent(req.params.pageid, newContent));
});

export default aboutRouter;