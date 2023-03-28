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

describe("Testing POST /events/create/:userID", () => {
  test("POST Create a new event", async () => {
    const event = {
      name: "Cool Event",
      location: "Hack Hall",
      description: "This is a cool event",
      startDate: new Date("2021-03-01T00:00:00.000Z"),
      endDate: new Date("2021-03-01T00:00:00.000Z"),
      capacity: 10,
    };
    const users = await request(app).get("/users");
    const response = await request(app).post(`/events/create/${users.body[1].id}`).send(event);
    const data = response.body;
    expect(data.name).toBe("Cool Event");
    expect(data.location).toBe("Hack Hall");

    expect(response.status).toBe(201);
  });

  test("POST Create a new event with an empty name", async () => {
    const event = {};
    const users = await request(app).get("/users");
    const response = await request(app).post(`/events/create/${users.body[0].id}`).send(event);
    expect(response.status).toBe(500);
  });
});

describe("Testing PUT /events/:eventid", () => {
  test("Successfully update event", async () => {
    const event = {
      name: "New Event",
    };

    const events = await request(app).get("/events");
    const eventid = events.body[1].id;

    const response = await request(app)
      .put("/events/" + eventid)
      .send(event);
    const data = response.body;
    expect(data.name).toBe("New Event");
    expect(response.status).toBe(200);
  });
});

describe ("Testing DELETE event",() => {

  test("Delete valid event", async () => {

        const events  = await request(app).get("/events");
        const eventid = events.body[1].id;
        const response = await request(app).delete("/events/delete/"+ eventid);
        expect(response.status).toBe(200);
      });

  test("Delete invalid event", async () => {
         const eventid = -1
         const response = await request(app).delete("/events/delete/" + eventid);
         expect(response.status).toBe(500);
       })
      })
