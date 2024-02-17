import request from "supertest";
import app from "../src/server";

// Testing events endpoints
describe("Testing GET /events", () => {
  test("Get all events in DB", async () => {
    const response = await request(app).get("/events");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /events/upcoming", () => {
  test("Get all upcoming events in DB", async () => {
    const response = await request(app).get("/events/upcoming");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /events/current", () => {
  test("Get all get current events in DB", async () => {
    const response = await request(app).get("/events/current");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /events/past", () => {
  test("Get all past events in DB", async () => {
    const response = await request(app).get("/events/past");
    expect(response.status).toBe(200);
  });
});

describe("Testing POST /events/:userid", () => {
  test("POST Create a new event", async () => {
    const users = await request(app).get("/users");
    const eventDTO = {
      userID: `${users.body.data.result[1].id}`,
      event: {
        name: "Cool Event",
        location: "Hack Hall",
        description: "This is a cool event",
        startDate: new Date("2021-03-01T00:00:00.000Z"),
        endDate: new Date("2021-03-01T00:00:00.000Z"),
        capacity: 10,
      },
    };
    const response = await request(app).post("/events").send(eventDTO);
    const data = response.body.data;
    expect(data.name).toBe("Cool Event");
    expect(data.location).toBe("Hack Hall");

    expect(response.status).toBe(201);
  });

  test("POST Create a new event with an empty name", async () => {
    const users = await request(app).get("/users");
    const eventDTO = {
      userID: `${users.body.data.result[0].id}`,
      event: {},
    };
    const response = await request(app).post("/events").send(eventDTO);
    expect(response.status).toBe(500);
  });
});

describe("Testing PUT /events/:eventid", () => {
  test("Successfully update event", async () => {
    const event = {
      name: "New Event",
    };
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[1].id;
    const response = await request(app)
      .put("/events/" + eventid)
      .send(event);
    const data = response.body.data;
    expect(data.name).toBe("New Event");
    expect(response.status).toBe(200);
  });
});

describe("Testing POST /events/:eventid/attendees", () => {
  test("Add attendee for existing event", async () => {
    const events = await request(app).get("/events");
    const users = await request(app).get("/users");
    const eventid = events.body.data.result[1].id;
    const attendeeid_1 = users.body.data.result[1].id;
    const attendee1 = {
      attendeeid: `${attendeeid_1}`,
    };
    const response = await request(app)
      .post("/events/" + eventid + "/attendees/")
      .send(attendee1);
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /events/:eventid", () => {
  test("Get existing event", async () => {
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[1].id;
    const response = await request(app).get("/events/" + eventid);
    expect(response.status).toBe(200);
  });

  test("Get non-existing event", async () => {
    const eventid = -1;
    const response = await request(app).get("/events/" + eventid);
    expect(response.body.data).toEqual(null);
  });
});

describe("Testing GET /events/:eventid/attendees", () => {
  test("Get attendees for existing event", async () => {
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[0].id;
    const response = await request(app).get(
      "/events/" + eventid + "/attendees"
    );
    expect(response.status).toBe(200);
  });

  test("Get attendees for invalid event", async () => {
    const eventid = -1;
    const response = await request(app).get(
      "/events/" + eventid + "/attendees"
    );
    expect(response.body.data.length).toBe(0);
  });
});

describe("Testing PATCH /events/:eventid/status", () => {
  test("Update event status to active", async () => {
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[0].id;
    const status = "ACTIVE";
    const response = await request(app)
      .patch(`/events/${eventid}/status`)
      .send({ status: `${status}` });
    const data = response.body.data;
    expect(response.status).toBe(200);
    expect(data.status).toBe("ACTIVE");
  });

  test("Event status invalid", async () => {
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[0].id;
    const status = "COMPLETE";
    const response = await request(app)
      .patch("/events/" + eventid + "/status")
      .send({ status: status });
    expect(response.status).toBe(500);
  });
});

describe("Testing PATCH /events/:eventid/owner", () => {
  test("Change current owner", async () => {
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[1].id;
    const users = await request(app).get("/users");
    const ownerid = users.body.data.result[1].id;
    const response = await request(app)
      .patch("/events/" + eventid + "/owner")
      .send({ ownerid: `${ownerid}` });
    const data = response.body.data;
    expect(response.status).toBe(200);
    expect(data.ownerId).toBe(users.body.data.result[1].id);
  });

  test("Change current owner to invalid", async () => {
    const events = await request(app).get("/events");
    const eventid = events.body.data.result[1].id;
    const users = await request(app).get("/users");
    const ownerid = users.body.data[-1];
    const response = await request(app)
      .patch("/events/" + eventid + "/owner")
      .send({ ownerid: `${ownerid}` });
    expect(response.status).toBe(500);
  });
});

describe("Testing PATCH /events/:eventid/attendees/:attendeeid/confirm", () => {
  test("Update attendee as showed up", async () => {
    const events = await request(app).get("/events");
    const attendees = await request(app).get("/users");
    const eventid = events.body.data.result[1].id;
    const attendeeid = attendees.body.data.result[1].id;
    const response = await request(app).patch(
      "/events/" + eventid + "/attendees/" + attendeeid + "/confirm"
    );
    const data = response.body.data;
    expect(data.showedUp).toBe(true);
    expect(response.status).toBe(200);
  });

  test("Invalid update attendee as showed up", async () => {
    const attendees = await request(app).get("/users");
    const attendeeid = attendees.body.data.result[0].id;
    const response = await request(app).patch(
      "/events/" + -1 + "/attendees/" + attendeeid + "/confirm"
    );
    expect(response.status).toBe(500);
  });
});

describe("Testing DELETE /events/:eventid/attendees/:attendeeid", () => {
  test("Delete an attendee", async () => {
    const events = await request(app).get("/events");
    const attendees = await request(app).get("/users");
    const eventid = events.body.data.result[1].id;
    const attendeeid = attendees.body.data.result[1].id;
    const response = await request(app)
      .put("/events/" + eventid + "/attendees/")
      .send({
        attendeeid: attendeeid,
        cancelationMessage: "I can't go anymore",
      });

    expect(response.body.data.canceled).toBe(true);
    expect(response.body.data.cancelationMessage).toBe("I can't go anymore");
  });
});

// Note: Deleting an event still has to be extensively tested
// describe("Testing DELETE event", () => {
//   test("Delete valid event", async () => {
//     const events = await request(app).get("/events");
//     const eventid = events.body.data.result[2].id;
//     const response = await request(app).delete("/events/" + eventid);
//     expect(response.status).toBe(200);
//     const deletedEvent = await request(app).get("/events/" + eventid);
//     expect(deletedEvent.body.data).toEqual(null);
//   });

//   test("Delete invalid event", async () => {
//     const eventid = -1;
//     const response = await request(app).delete("/events/" + eventid);
//     expect(response.status).toBe(500);
//   });
// });
