import { Router } from "express";
import userController from "./controllers";
import { auth } from "../middleware/auth"
const userRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
// HERE IS A TYPESCRIPT COMPILER ERROR THAT WE DON'T KNOW HOW TO FIX :)
//@ts-ignore
userRouter.post("/", auth, userController.createUser);
//@ts-ignore
userRouter.delete("/:userID", auth, userController.deleteUser);
//@ts-ignore
userRouter.put("/:userID", auth, userController.updateUser);
//@ts-ignore
userRouter.get("/", auth, userController.getAllUsers);
//@ts-ignore
userRouter.get("/search", auth, userController.getSearchedUser);

export default userRouter;
