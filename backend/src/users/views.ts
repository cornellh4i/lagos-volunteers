import { Router } from "express";
import userController from "./controllers";

const userRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
userRouter.get("/", userController.getUsers);
userRouter.post("/signup", userController.createNewUser);
userRouter.get("/all", userController.getAllUsers);
userRouter.get("/search?[option]=[value]", userController.getSearchedUser);

export default userRouter;
