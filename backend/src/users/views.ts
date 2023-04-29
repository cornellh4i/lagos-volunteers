import { Router, RequestHandler, Request, Response } from "express";
import userController from "./controllers";
import { auth, setVolunteerCustomClaims, NoAuth } from "../middleware/auth";
const userRouter = Router();

import { attempt } from "../utils/helpers";

let useAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? (useAuth = NoAuth as RequestHandler)
  : (useAuth = auth as RequestHandler);

userRouter.post(
  "/",
  NoAuth as RequestHandler,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 201, () =>
      userController.createUser(
        req.body,
        req.body.profile,
        req.body.preferences,
        req.body.permissions
      )
    );
    // try {
    //   await setVolunteerCustomClaims(req.body.email);
    // } catch (e) {
    //   console.log(e);
    // }
  }
);

userRouter.delete("/:userid", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.deleteUser(req.params.userid));
});

userRouter.put("/:userid", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () =>
    userController.updateUser(req.params.userid, req.body)
  );
});

userRouter.get("/", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, userController.getAllUsers);
});

userRouter.get("/pagination", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUsersPaginated(req));
});

userRouter.get("/search", useAuth, async (req: Request, res: Response) => {
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

userRouter.get("/sorting", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUsersSorted(req));
});

userRouter.get(
  "/:userid/profile",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () => userController.getUserProfile(req.params.userid));
  }
);

userRouter.get(
  "/:userid/role",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () => userController.getUserRole(req.params.userid));
  }
);

userRouter.get(
  "/:userid/preferences",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.getUserPreferences(req.params.userid)
    );
  }
);

userRouter.get("/:userid", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, () => userController.getUserByID(req.params.userid));
});

userRouter.get(
  "/:userid/created",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () => userController.getCreatedEvents(req.params.userid));
  }
);

userRouter.get(
  "/:userid/registered",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.getRegisteredEvents(req.params.userid)
    );
  }
);

userRouter.get(
  "/:userid/hours",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () => userController.getHours(req.params.userid));
  }
);

userRouter.put(
  "/:userid/profile",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editProfile(req.params.userid, req.body)
    );
  }
);

userRouter.put(
  "/:userid/preferences",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editPreferences(req.params.userid, req.body)
    );
  }
);

userRouter.patch(
  "/:userid/status/:status",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editStatus(req.params.userid, req.params.status)
    );
  }
);

userRouter.patch(
  "/:userid/role/:role",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editRole(req.params.userid, req.params.role)
    );
  }
);

userRouter.patch(
  "/:userid/hours/:hours",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () =>
      userController.editHours(req.params.userid, req.params.hours)
    );
  }
);

export default userRouter;
