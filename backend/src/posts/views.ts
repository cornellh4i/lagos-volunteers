// use Controllers here, just as we did in ../users/controllers.ts

import { Router } from "express";
import postController from "./controllers";

const postRouter = Router();

/** Post Specific Routes */
postRouter.post("/create", postController.createNewPost);
// Note that they both have the same routes but different methods.
// This is an example of how to use the same route for different methods.
postRouter.delete("/:id", postController.deletePost);
postRouter.get("/:id", postController.getPost);
postRouter.put("/publish/:id", postController.publishPost);
postRouter.get("/feed", postController.getAllPublishedPosts);

export default postRouter;
