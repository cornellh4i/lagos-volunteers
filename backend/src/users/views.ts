import { Router, RequestHandler, Request, Response } from "express";
import { Prisma, userRole, UserStatus, EnrollmentStatus } from "@prisma/client";
import userController from "./controllers";
import {
  auth,
  setVolunteerCustomClaims,
  updateFirebaseUserToSupervisor,
  updateFirebaseUserToAdmin,
  NoAuth,
  authIfAdmin,
  authIfSupervisor,
} from "../middleware/auth";
const userRouter = Router();
import * as firebase from "firebase-admin";
import { attempt, socketNotify } from "../utils/helpers";

let useAuth: RequestHandler;
let useAdminAuth: RequestHandler;
let useSupervisorAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? ((useAuth = NoAuth as RequestHandler),
    (useAdminAuth = NoAuth as RequestHandler),
    (useSupervisorAuth = NoAuth as RequestHandler))
  : ((useAuth = auth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler),
    (useSupervisorAuth = authIfSupervisor as RequestHandler));

userRouter.post(
  "/",
  NoAuth as RequestHandler,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    socketNotify("/users");
    let user;
    const { password, ...rest } = req.body;
    try {
      // Create user in local database
      user = await userController.createUser(
        rest,
        rest.profile,
        rest.preferences,
        rest.permissions
      );

      // If local user doesn't exist, throw error
      if (!user) {
        throw Error("Failed to create local user");
      }

      // If test environment, return user without firebase auth
      else if (process.env.NODE_ENV === "test") {
        return res.status(201).send({ success: true, data: user });
      }

      // Otherwise, create user in Firebase
      else {
        const fbUser = await firebase.auth().createUser({
          uid: user.id,
          email: rest.email,
          password: password,
        });
        if (fbUser) {
          await firebase.auth().setCustomUserClaims(fbUser.uid, {
            admin: false,
            supervisor: false,
            volunteer: true,
          });
          return res.status(200).send({ success: true, user: user });
        }
      }
    } catch (e: any) {
      // If user exists in local database but not in Firebase, delete user
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
  socketNotify("/users");
});

userRouter.put("/:userid", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Users']

  // Do API call
  attempt(res, 200, () =>
    userController.updateUser(req.params.userid, req.body)
  );
  socketNotify(`/users/${req.params.userid}`);
});

userRouter.get(
  "/count",
  useAdminAuth || useSupervisorAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, userController.getCountUsers);
  }
);

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
    attendeeStatus: req.query.attendeeStatus as EnrollmentStatus,
    emailOrName: req.query.emailOrName as string,
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

  const include = {
    hours: req.query.include === "hours" ? true : false,
  };

  attempt(res, 200, () =>
    userController.getUsers(filter, sort, pagination, include)
  );
});

userRouter.get(
  "/pagination",
  useAdminAuth || useSupervisorAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () => userController.getUsersPaginated(req));
  }
);

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

userRouter.get(
  "/sorting",
  useAdminAuth || useSupervisorAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    attempt(res, 200, () => userController.getUsersSorted(req));
  }
);

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
    socketNotify(`/users/${req.params.userid}`);
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
    socketNotify(`/users/${req.params.userid}`);
  }
);

userRouter.patch(
  "/:userid/status",
  useAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const { status } = req.body;
    attempt(res, 200, () =>
      userController.editStatus(req.params.userid, status)
    );
    socketNotify(`/users/${req.params.userid}`);
  }
);

userRouter.patch(
  "/:userid/role",
  useAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const { role } = req.body;
    const userid = req.params.userid;
    const user = await userController.getUserByID(userid);

    try {
      if (user) {
        const email = user?.email;
        if (role === "VOLUNTEER") {
          const response = await setVolunteerCustomClaims(email);
        } else if (role === "SUPERVISOR") {
          const response = await updateFirebaseUserToSupervisor(email);
        } else if (role === "ADMIN") {
          const response = await updateFirebaseUserToAdmin(email);
        } else {
          throw new Error("Invalid role type");
        }

        const editRoleResponse = await userController.editRole(userid, role);
        socketNotify(`/users/${req.params.userid}`);
        res.status(200).json(editRoleResponse);
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

userRouter.patch(
  "/:userid/hours",
  useAdminAuth || useSupervisorAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    const { hours } = req.body;
    attempt(res, 200, () => userController.editHours(req.params.userid, hours));
    socketNotify(`/users/${req.params.userid}`);
  }
);

export default userRouter;
