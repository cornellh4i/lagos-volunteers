// use Controllers here, just as we did in ../users/controllers.ts

import { Router } from "express";
import postController from "./controllers";

const postRouter = Router();

/** Post Specific Routes */
postRouter.post("/create", postController.createNewPost);
// Note:  I have put /feed here to illustrate a poinit. If it came after /:id, it would be interpreted as an id.
// So, we need to put it before /:id
postRouter.get("/feed", postController.getAllPublishedPosts);
postRouter.delete("/:id", postController.deletePost);
postRouter.get("/:id", postController.getPost);
postRouter.put("/publish/:id", postController.publishPost);

export default postRouter;
