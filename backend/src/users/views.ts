import { Router } from "express";
import userController from "./controllers";

const userRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
userRouter.post("/", userController.createUser);
userRouter.delete("/:userID", userController.deleteUser);
userRouter.put("/:userID", userController.updateUser);
userRouter.get("/", userController.getAllUsers);
userRouter.get("/search", userController.getSearchedUser);
userRouter.get("/:userid/profile", userController.getUserProfile);
userRouter.get("/:userid/role", userController.getUserRole);
userRouter.get("/:userid/preferences", userController.getUserPreferences);
userRouter.get("/:userid", userController.getUserByID);
userRouter.get("/:userid/created", userController.getCreatedEvents);
userRouter.get("/:userid/registered", userController.getRegisteredEvents);
userRouter.get("/:userid/hours", userController.getHours);

export default userRouter;
