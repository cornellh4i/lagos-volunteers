import { Router } from "express";
import userController from "./controllers";

const userRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
userRouter.get("/", userController.getUsers);
userRouter.post("/signup", userController.createNewUser);

export default userRouter;
