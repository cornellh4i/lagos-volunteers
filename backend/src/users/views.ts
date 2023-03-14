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
userRouter.get("/users/:userid/profile", userController.getUserProfile); 
userRouter.get("/users/:userid/role", userController.getUserRole); 
userRouter.get("/users/:userid/preferences", userController.getUserPreferences); 
userRouter.get("/:userID", userController.getUserByID)
userRouter.get("/:userID/created", userController.getCreatedEvents)
userRouter.get("/:userID/registered", userController.getRegisteredEvents)
userRouter.get("/:userID/hours", userController.getHours)


export default userRouter;
