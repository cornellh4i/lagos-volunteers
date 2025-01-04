import { Router, RequestHandler, Request, Response } from "express";
import eventController from "./controllers";
import {
  auth,
  NoAuth,
  authIfAdmin,
  authIfSupervisorOrAdmin,
  authIfVolunteer,
} from "../middleware/auth";
import {
  attempt,
  checkUserMatchOrSupervisorAdmin,
  socketNotify,
} from "../utils/helpers";

import { errorJson, successJson } from "../utils/jsonResponses";
import { EventMode, EventStatus, Prisma } from "@prisma/client";

const eventRouter = Router();

let useAuth: RequestHandler;
let useAdminAuth: RequestHandler;
let useSupervisorAdminAuth: RequestHandler;

process.env.NODE_ENV === "test"
  ? ((useAuth = NoAuth as RequestHandler),
    (useAdminAuth = NoAuth as RequestHandler),
    (useSupervisorAdminAuth = NoAuth as RequestHandler))
  : ((useAuth = auth as RequestHandler),
    (useAdminAuth = authIfAdmin as RequestHandler),
    (useSupervisorAdminAuth = authIfSupervisorOrAdmin as RequestHandler));

export type EventDTO = {
  userID: string;
  event: {
    name: string;
    subtitle?: string;
    location: string;
    description: string;
    imageURL?: string;
    startDate: Date;
    endDate: Date;
    mode?: EventMode;
    status?: EventStatus;
    capacity: number;
  };
};

eventRouter.post(
  "/",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    const eventDTO: EventDTO = req.body;
    attempt(res, 201, () => eventController.createEvent(eventDTO));
    socketNotify("/events");
  }
);

eventRouter.put(
  "/:eventid",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.updateEvent(req.params.eventid, req.body)
    );
    socketNotify(`/events/${req.params.eventid}`);
  }
);

eventRouter.delete(
  "/:eventid",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () => eventController.deleteEvent(req.params.eventid));
    socketNotify("/events");
  }
);

eventRouter.get("/", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const filter = {
    date: req.query.date as string,
    ownerId: req.query.ownerid as string,
    userId: req.query.userid as string,
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
    attendees: req.query.include === "attendees" ? true : false,
  };

  attempt(res, 200, () =>
    eventController.getEvents(filter, sort, pagination, include)
  );
});

eventRouter.get("/upcoming", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, eventController.getUpcomingEvents);
});

eventRouter.get("/current", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, eventController.getCurrentEvents);
});

eventRouter.get("/past", useAuth, async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, eventController.getPastEvents);
});

eventRouter.get("/:eventid", useAuth, async (req: Request, res: Response) => {
  attempt(res, 200, () => eventController.getEvent(req.params.eventid));
});

eventRouter.get(
  "/:eventid/attendees",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () => eventController.getAttendees(req.params.eventid));
  }
);

eventRouter.get(
  "/:eventid/attendees/:userid",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.getAttendee(req.params.eventid, req.params.userid)
    );
  }
);

eventRouter.get(
  "/:eventid/attendees/registered/length",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.getRegisteredVolunteerNumberInEvent(req.params.eventid)
    );
  }
);

eventRouter.post(
  "/:eventid/attendees",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    const { attendeeid } = req.body;
    checkUserMatchOrSupervisorAdmin(req, res, attendeeid, async () => {
      attempt(res, 200, () =>
        eventController.addAttendee(req.params.eventid, attendeeid)
      );
      socketNotify(`/events/${req.params.eventid}`);
    });
  }
);

eventRouter.patch(
  "/:eventid/attendees/:userid/attendee-status",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    const { attendeeStatus } = req.body;
    attempt(res, 200, () =>
      eventController.updateEnrollmentStatus(
        req.params.eventid,
        req.params.userid,
        attendeeStatus
      )
    );
    socketNotify(`/events/${req.params.eventid}`);
  }
);

eventRouter.put(
  "/:eventid/attendees/:attendeeid/cancel",
  useAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    checkUserMatchOrSupervisorAdmin(
      req,
      res,
      req.params.attendeeid,
      async () => {
        const { cancelationMessage } = req.body;
        attempt(res, 200, () =>
          eventController.deleteAttendee(
            req.params.eventid,
            req.params.attendeeid,
            cancelationMessage
          )
        );
        socketNotify(`/events/${req.params.eventid}`);
      }
    );
  }
);

eventRouter.patch(
  "/:eventid/status",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    const { status } = req.body;
    attempt(res, 200, () =>
      eventController.updateEventStatus(req.params.eventid, status)
    );
    socketNotify(`/events/${req.params.eventid}`);
  }
);

eventRouter.patch(
  "/:eventid/owner",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    const { ownerid } = req.body;
    attempt(res, 200, () =>
      eventController.updateEventOwner(req.params.eventid, ownerid)
    );
  }
);

eventRouter.patch(
  "/:eventid/attendees/:attendeeid/confirm",
  useSupervisorAdminAuth,
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.confirmUser(req.params.eventid, req.params.attendeeid)
    );
    socketNotify(`/events/${req.params.eventid}`);
  }
);

export default eventRouter;
