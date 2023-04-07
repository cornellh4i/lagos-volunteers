import { Router, RequestHandler, Request, Response } from "express";
import userController from "./controllers";
import { auth } from "../middleware/auth";
const userRouter = Router();

import { errorJson, successJson } from "../utils/jsonResponses";

/** User Specific Routes */

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
  userRouter.use(auth as RequestHandler);
}

userRouter.post("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(201)
      .send(
        await userController.createUser(
          req.body,
          req.body.profile,
          req.body.preferences,
          req.body.permissions
        )
      );
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});
userRouter.delete("/:userID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.deleteUser(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.put("/:userID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.updateUser(req.params.userID, req.body));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.getAllUsers());
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/pagination", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.getUsersPaginated(req));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/search", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  const { email, firstName, lastName, role, status, hours, nickname } =
    req.body;
  try {
    res
      .status(200)
      .send(
        await userController.getSearchedUser(
          req,
          email,
          firstName,
          lastName,
          role,
          status,
          hours,
          nickname
        )
      );
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/sorting", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.getUsersSorted(req));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID/profile", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.getUserProfile(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID/role", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.getUserRole(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID/preferences", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.getUserPreferences(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.getUserByID(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID/created", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.getCreatedEvents(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID/registered", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.getRegisteredEvents(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.get("/:userID/hours", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res.status(200).send(await userController.getHours(req.params.userID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.put("/:userid/profile", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.editProfile(req.params.userid, req.body));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.put("/:userid/preferences", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.editPreferences(req.params.userid, req.body));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.patch(
  "/:userid/status/:status",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    try {
      res
        .status(200)
        .send(
          await userController.editStatus(req.params.userid, req.params.status)
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);
userRouter.patch("/:userid/role/:role", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  try {
    res
      .status(200)
      .send(await userController.editRole(req.params.userid, req.params.role));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

userRouter.patch(
  "/:userid/hours/:hours",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    try {
      res
        .status(200)
        .send(
          await userController.editHours(req.params.userid, req.params.hours)
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);

export default userRouter;
