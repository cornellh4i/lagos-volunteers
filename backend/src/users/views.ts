import { Router } from "express";
import userController from "./controllers";

// Note: we should use a try/catch to choose successJson or errorJson for responses
// this has been left out of this snippet for brevity
import { successJson, errorJson } from "../utils/jsonResponses";

const userRouter = Router();

// Get all users
userRouter.get("/", async (req, res) => {
  res.send(await userController.getUsers());
});

// Crtate a new user
userRouter.get("/signup", async (req, res) => {
  const { name, email, posts } = req.body;

  const result = await userController.createNewUser({ name, email, posts });
  if (result) {
    res.send(successJson(result)).status(201);
  } else {
    res.send(errorJson("Error creating user")).status(400);
  }
});

export default userRouter;
