import { Router } from "express";
import usersController from "./controllers";

const usersRouter = Router();

/** User Specific Routes */

// This approach is cleaner for us becuase we can easily add middle ware
usersRouter.get("/all", usersController.getAllUsers);
usersRouter.get("/search", usersController.getSearchedUser);

export default usersRouter;
