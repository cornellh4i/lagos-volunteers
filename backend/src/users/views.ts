import { Router, RequestHandler, Request, Response } from "express";
import userController from "./controllers";
import { auth } from "../middleware/auth";
const userRouter = Router();

import { attempt } from "../utils/helpers";

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
  userRouter.use(auth as RequestHandler);
}

userRouter.post("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 201, () =>
    userController.createUser(
      req.body,
      req.body.profile,
      req.body.preferences,
      req.body.permissions
    )
  );
});

userRouter.delete("/:userid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.deleteUser(req.params.userid));
});

userRouter.put("/:userid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () =>
    userController.updateUser(req.params.userid, req.body)
  );
});

userRouter.get("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, userController.getAllUsers);
});

userRouter.get("/pagination", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUsersPaginated(req));
});

userRouter.get("/search", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  const { email, firstName, lastName, role, status, hours, nickname } =
    req.body;
  attempt(res, 200, () =>
    userController.getSearchedUser(
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
});

userRouter.get("/sorting", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUsersSorted(req));
});

userRouter.get("/:userid/profile", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUserProfile(req.params.userid));
});

userRouter.get("/:userid/role", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUserRole(req.params.userid));
});

userRouter.get("/:userid/preferences", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUserPreferences(req.params.userid));
});

userRouter.get("/:userid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUserByID(req.params.userid));
});

userRouter.get("/:userid/created", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getCreatedEvents(req.params.userid));
});

userRouter.get("/:userid/registered", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () =>
    userController.getRegisteredEvents(req.params.userid)
  );
});

userRouter.get("/:userid/hours", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getHours(req.params.userid));
});

userRouter.put("/:userid/profile", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () =>
    userController.editProfile(req.params.userid, req.body)
  );
});

userRouter.put("/:userid/preferences", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () =>
    userController.editPreferences(req.params.userid, req.body)
  );
});

userRouter.patch(
  "/:userid/status/:status",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editStatus(req.params.userid, req.params.status)
    );
  }
);

userRouter.patch("/:userid/role/:role", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () =>
    userController.editRole(req.params.userid, req.params.role)
  );
});

userRouter.patch(
  "/:userid/hours/:hours",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editHours(req.params.userid, req.params.hours)
    );
  }
);

export default userRouter;
