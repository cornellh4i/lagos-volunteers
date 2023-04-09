import { Router, RequestHandler, Request, Response } from "express";
import eventController from "./controllers";
import { auth } from "../middleware/auth";

import { errorJson, successJson } from "../utils/jsonResponses";

const eventRouter = Router();

// No provision for auth in test environment for now
if (process.env.NODE_ENV !== "test") {
  eventRouter.use(auth as RequestHandler);
}

eventRouter.post("/create/:userID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res
      .status(201)
      .send(await eventController.createEvent(req.params.userID, req));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.put("/:eventID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res
      .status(200)
      .send(await eventController.updateEvent(req.params.eventID, req.body));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.delete("/delete/:eventID", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res.status(200).send(await eventController.deleteEvent(req.params.eventID));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.get("/", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res.status(200).send(await eventController.getEvents());
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.get("/upcoming", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res.status(200).send(await eventController.getUpcomingEvents());
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.get("/current", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res.status(200).send(await eventController.getCurrentEvents());
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.get("/past", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res.status(200).send(await eventController.getPastEvents());
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.get("/:eventid", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res.status(200).send(await eventController.getEvent(req.params.eventid));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.get("/:eventid/attendees", async (req: Request, res: Response) => {
  // #swagger.tags = ['Events']
  try {
    res
      .status(200)
      .send(await eventController.getAttendees(req.params.eventid));
  } catch (error) {
    res.status(500).send(errorJson(error));
  }
});

eventRouter.post(
  "/:eventid/:attendeeid",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    try {
      res
        .status(200)
        .send(
          await eventController.addAttendee(
            req.params.eventid,
            req.params.attendeeid
          )
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);

eventRouter.delete(
  "/:eventid/attendees/:attendeeid",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    try {
      res
        .status(200)
        .send(
          await eventController.deleteAttendee(
            req.params.eventid,
            req.params.attendeeid
          )
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);

eventRouter.patch(
  "/:eventid/status/:status",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    try {
      res
        .status(200)
        .send(
          await eventController.updateEventStatus(
            req.params.eventid,
            req.params.status
          )
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);

eventRouter.patch(
  "/:eventid/owner/:ownerid",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    try {
      res
        .status(200)
        .send(
          await eventController.updateEventOwner(
            req.params.eventid,
            req.params.ownerid
          )
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);

eventRouter.patch(
  "/:eventid/attendees/:attendeeid/confirm",
  async (req: Request, res: Response) => {
    // #swagger.tags = ['Events']
    try {
      res
        .status(200)
        .send(
          await eventController.confirmUser(
            req.params.eventid,
            req.params.attendeeid
          )
        );
    } catch (error) {
      res.status(500).send(errorJson(error));
    }
  }
);

export default eventRouter;
