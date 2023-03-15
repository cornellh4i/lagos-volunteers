import { Router, RequestHandler } from "express";
import userController from "./controllers";
import { auth } from "../middleware/auth";
const userRouter = Router();

/** User Specific Routes */

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
  userRouter.use(auth as RequestHandler);
}

// This approach is cleaner for us becuase we can easily add middle ware
userRouter.post("/", userController.createUser);
userRouter.delete("/:userID", userController.deleteUser);
userRouter.put("/:userID", userController.updateUser);
userRouter.get("/", userController.getAllUsers);
userRouter.get("/search", userController.getSearchedUser);
userRouter.put("/:userid/profile", userController.editProfile);
userRouter.put("/:userid/preferences", userController.editPreferences);
userRouter.patch("/:userid/status/:status", userController.editStatus);
userRouter.patch("/:userid/role/:role", userController.editRole);
userRouter.patch("/:userid/hours/:hours", userController.editHours);

// generalize the patch requests

export default userRouter;
