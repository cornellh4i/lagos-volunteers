import { Router, RequestHandler, Request, Response } from "express";
import eventController from "./controllers";
import { auth } from "../middleware/auth";
import { attempt } from "../utils/helpers";

const eventRouter = Router();

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
  eventRouter.use(auth as RequestHandler);
}

eventRouter.post("/:eventID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 201, () => eventController.createEvent(req.params.eventID, req));
});

eventRouter.put("/:eventID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () =>
    eventController.updateEvent(req.params.eventID, req.body)
  );
});

eventRouter.delete("/delete/:eventID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.deleteEvent(req.params.eventID));
});

eventRouter.get("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.getEvents());
});

eventRouter.get("/upcoming", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.getUpcomingEvents());
});

eventRouter.get("/current", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.getCurrentEvents());
});

eventRouter.get("/past", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.getPastEvents());
});

eventRouter.get("/:eventid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.getEvent(req.params.eventid));
});

eventRouter.get("/:eventid/attendees", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  attempt(res, 200, () => eventController.getAttendees(req.params.eventid));
});

eventRouter.post(
  "/:eventid/:attendeeid",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.addAttendee(req.params.eventid, req.params.attendeeid)
    );
  }
);

eventRouter.delete(
  "/:eventid/attendees/:attendeeid",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.deleteAttendee(req.params.eventid, req.params.attendeeid)
    );
  }
);

eventRouter.patch(
  "/:eventid/status/:status",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.updateEventStatus(req.params.eventid, req.params.status)
    );
  }
);

eventRouter.patch(
  "/:eventid/owner/:ownerid",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.updateEventOwner(req.params.eventid, req.params.ownerid)
    );
  }
);

eventRouter.patch(
  "/:eventid/attendees/:attendeeid/confirm",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    attempt(res, 200, () =>
      eventController.confirmUser(req.params.eventid, req.params.attendeeid)
    );
  }
);

export default eventRouter;
