import { Router, RequestHandler, Request, Response } from "express";
import { Prisma, userRole, UserStatus } from "@prisma/client";
import userController from "./controllers";
import { auth, setVolunteerCustomClaims, NoAuth } from "../middleware/auth";
const userRouter = Router();
import * as firebase from "firebase-admin";

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
    // if you're seeing this, no you didn't
    let user;
    const { password, ...rest } = req.body;
    try {
      user = await userController.createUser(
        rest,
        rest.profile,
        rest.preferences,
        rest.permissions
      );
      if (user && process.env.NODE_ENV !== "test") {
        const fbUser = await firebase.auth().createUser({
          uid: user.id,
          email: rest.email,
          password: password,
        });
        if (fbUser) {
          await firebase.auth().setCustomUserClaims(fbUser.uid, {
            volunteer: true,
          });
          return res.status(200).send({ success: true, user: user });
        }
      }
    } catch (e: any) {
      if (user) {
        try {
          await userController.deleteUser(user.id);
        } catch (e: any) {
          return res.status(500).send({ success: false, error: e.message });
        }
      }
      return res.status(500).send({ success: false, error: e.message });
    }
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

userRouter.get("/count", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  attempt(res, 200, userController.getCountUsers);
});

userRouter.get("/", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  const filter = {
    firstName: req.query.firstName as string,
    lastName: req.query.lastName as string,
    nickname: req.query.nickname as string,
    email: req.query.email as string,
    role: req.query.role as userRole,
    hours: req.query.hours ? parseInt(req.query.hours as string) : undefined,
    status: req.query.status as UserStatus,
    eventId: req.query.eventId as string,
  };

  const sortQuery = req.query.sort as string;
  const querySplit = sortQuery ? sortQuery.split(":") : ["default", "asc"];
  const key = querySplit[0];
  const order = querySplit[1] as Prisma.SortOrder;
  const sort = {
    key: key,
    order: order,
  };

  const pagination = {
    after: req.query.after as string,
    limit: req.query.limit as string,
  };

  attempt(res, 200, () => userController.getUsers(filter, sort, pagination));
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
      userController.getRegisteredEvents(
        req.params.userid,
        req.query.eventid as string
      )
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

userRouter.patch("/:userid/status", async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']
  const { status } = req.body;
  attempt(res, 200, () => userController.editStatus(req.params.userid, status));
});

userRouter.patch(
  "/:userid/role",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const { role } = req.body;
    attempt(res, 200, () => userController.editRole(req.params.userid, role));
  }
);

userRouter.patch(
  "/:userid/hours",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const { hours } = req.body;
    attempt(res, 200, () => userController.editHours(req.params.userid, hours));
  }
);

export default userRouter;
