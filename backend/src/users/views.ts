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

export default userRouter;
