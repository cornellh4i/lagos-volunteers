import { Router } from "express";
import userController from "./controllers";
import { auth, authIfAdmin } from "../middleware/auth"
const userRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
// HERE IS A TYPESCRIPT COMPILER ERROR THAT WE DON'T KNOW HOW TO FIX :)
//@ts-ignore
userRouter.post("/", auth, userController.createUser);
userRouter.delete("/:userID", userController.deleteUser);
userRouter.put("/:userID", userController.updateUser);
//@ts-ignore
userRouter.get("/", auth, userController.getAllUsers);
//@ts-ignore
userRouter.get("/search",auth, userController.getSearchedUser);
//@ts-ignore
userRouter.get("/:userID", userController.getUserByID);

export default userRouter;
