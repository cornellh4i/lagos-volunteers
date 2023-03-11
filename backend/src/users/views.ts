import { Router } from "express";
import userController from "./controllers";
import { auth } from "../middleware/auth"
const userRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
userRouter.post("/", userController.createUser);
userRouter.delete("/:userID", userController.deleteUser);
userRouter.put("/:userID", userController.updateUser);
//@ts-ignore
// HERE IS A TYPESCRIPT COMPILER ERROR THAT WE DON'T KNOW HOW TO FIX :)
userRouter.get("/", auth, userController.getAllUsers);
userRouter.get("/search", userController.getSearchedUser);

export default userRouter;
