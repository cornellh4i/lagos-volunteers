import { Router, RequestHandler, Request, Response } from "express";
import eventController from "./controllers";
import { auth } from "../middleware/auth";
import { attempt, socketNotify } from "../utils/helpers";

import { errorJson, successJson } from "../utils/jsonResponses";
import { EventMode, EventStatus, Prisma } from "@prisma/client";

const eventRouter = Router();

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
  eventRouter.use(auth as RequestHandler);
}

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

eventRouter.post("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const eventDTO: EventDTO = req.body;
  attempt(res, 201, () => eventController.createEvent(eventDTO));
  socketNotify("/events");
});

eventRouter.put("/:eventid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () =>
    eventController.updateEvent(req.params.eventid, req.body)
  );
  socketNotify(`/events/${req.params.eventid}`);
});

eventRouter.delete("/:eventid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.deleteEvent(req.params.eventid));
  socketNotify("/events");
});

eventRouter.get("/", async (req: Request, res: Response) => {
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

  attempt(res, 200, () => eventController.getEvents(filter, sort, pagination));
});

eventRouter.get("/upcoming", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, eventController.getUpcomingEvents);
});

eventRouter.get("/current", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, eventController.getCurrentEvents);
});

eventRouter.get("/past", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, eventController.getPastEvents);
});

eventRouter.get("/:eventid", async (req: Request, res: Response) => {
  attempt(res, 200, () => eventController.getEvent(req.params.eventid));
});

eventRouter.get("/:eventid/attendees", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () =>
    eventController.getAttendees(req.params.eventid, req.query.userid as string)
  );
});

eventRouter.post("/:eventid/attendees", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const { attendeeid } = req.body;
  attempt(res, 200, () =>
    eventController.addAttendee(req.params.eventid, attendeeid)
  );
  socketNotify(`/events/${req.params.eventid}`);
});

eventRouter.put("/:eventid/attendees", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const { attendeeid, cancelationMessage } = req.body;
  attempt(res, 200, () =>
    eventController.deleteAttendee(
      req.params.eventid,
      attendeeid,
      cancelationMessage
    )
  );
  socketNotify(`/events/${req.params.eventid}`);
});

eventRouter.patch("/:eventid/status", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const { status } = req.body;
  attempt(res, 200, () =>
    eventController.updateEventStatus(req.params.eventid, status)
  );
  socketNotify(`/events/${req.params.eventid}`);
});

eventRouter.patch("/:eventid/owner", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  const { ownerid } = req.body;
  attempt(res, 200, () =>
    eventController.updateEventOwner(req.params.eventid, ownerid)
  );
});

eventRouter.patch(
  "/:eventid/attendees/:attendeeid/confirm",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.confirmUser(req.params.eventid, req.params.attendeeid)
    );
    socketNotify(`/events/${req.params.eventid}`);
  }
);

export default eventRouter;
