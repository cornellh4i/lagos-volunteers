import { Router } from "express";
import userController from "./controllers";

const userRouter = Router();

userRouter.post("/user/create", userController.createUser);
userRouter.delete("/user/delete/:userID", userController.deleteUser);
userRouter.put("/user/update/:userID", userController.updateUser);

export default userRouter;