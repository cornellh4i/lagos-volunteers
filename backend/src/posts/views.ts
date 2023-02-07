// use Controllers here, just as we did in ../users/controllers.ts

import { Router } from "express";

const postRouter = Router();

postRouter.get("/", (req, res) => {
  res.send("Hello from a subrouter");
});

postRouter.post("/", (req, res) => {
  res.send(req.body);
});

export default postRouter;
