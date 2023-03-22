import { UserImportBuilder } from "firebase-admin/lib/auth/user-import-builder";
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
        console.log(response.error);
        expect(response.status).toBe(200);
      });

  test("Delete invalid event", async () => {
         const eventid = -1
         const response = await request(app).delete("/events/delete/" + eventid);
         expect(response.status).toBe(500);
       })
      })


describe ("Testing GET event", () => {
  test("Get existing event", async () => {

    const events = await request(app).get("/events");
    const eventid = events.body[1].id;
    const response = await request(app).get("/events/get/" + eventid);
    expect(response.status).toBe(200);
  })

  test("Get non-existing event", async () => {

    const eventid = "";
    const response = await request(app).get("/events/get/" + eventid);
    expect(response.status).toBe(500);
  })
})

describe ("Testing GET all attendees", () => {
  test("Get attendees for existing event", async () => {

    const events = await request(app).get("/events");
    const eventid = events.body[1].id;
    const response = await request(app).get("/events/get/attendees/" + eventid);
    console.log(response.error);
    expect(response.status).toBe(200);
  })

  /*test("Get attendees for invalid event", async () => {

    const eventid = -1;
    const response = await request(app).get("/events/get/attendees/" + eventid);
    expect(response.status).toBe(500);
  })*/

  describe ("Testing POST/events/:eventid/:attendeeid", () => {
    test("Add attendee for existing event", async () => {

      const events = await request(app).get("/events");
      const eventID = events.body[1].eventid;
      const attendeeid = events.body[1].userId;
      //const userID = event.body[1].userID;
      const response = await request(app).post("/events/" + eventID + "/attendees/" + attendeeid);
      expect(response.status).toBe(200);
    })
  })

  /*describe("Testing DELETE /events/:eventid/attendees/:attendeeid", () => {
    test("Delete an attendee", async () => {
      /*const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const userID = events.body[0].userID;

      const events = await request(app).get("/events");
      const event = events.body[1];
      const eventID = events.body[1].id;
      const userID = event.body[1].userId;

      const response = await request(app).delete("/events/delete/" + eventID + "/attendees/" + userID);
      console.log(response.error);
      expect(response.status).toBe(200);
    });

    test("Delete an invalid attendee", async () => {
      const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const userID = events.body[0].userID;

      const response = await request(app).delete("/events/delete/" + eventID + "/attendees/" + userID);
      expect(response.status).toBe(500);
    });
  });*/
/*
  describe("Testing PATCH /events/:eventid/status/:status", () => {
    test("Update event status to active", async () => {
      const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const response = await request(app).patch("/events/" + eventID + "/status/ACTIVE")
      expect(response.status).toBe(200);
    });
    test("Update event status to completed", async () => {
      const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const response = await request(app).patch("/events/" + eventID + "/status/COMPLETED")
      expect(response.status).toBe(200);
    });
  });*/

  describe("Testing PATCH /events/:eventid/owner/:ownerid", () => {
    test("Change current owner", async () => {
      const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const users = await request(app).get("/users");
      const userid = users.body[0].id;
      const response = await request(app).patch("/events/" + eventID + "/owner/" + userid); 
      expect(response.status).toBe(200);
    });

    test("Change current owner", async () => {
      const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const users = await request(app).get("/users");
      const userid = users.body[0].id;
      const response = await request(app).patch("/events/" + eventID + "/owner/" + userid); 
      console.log(response.error);
      expect(response.status).toBe(200);
    });

  });

  /*
  describe("Testing PATCH /events/:eventid/attendees/:attendeeid/confirm", () => {
    test("Update attendee as showed up", async () => {
      const events = await request(app).get("/events");
      const eventID = events.body[1].id;
      const users = await request(app).get("/users");
      const userid = users.body[0].id;
      const response = await request(app).patch("/events/" + eventID + "/attendees/" + userid + "/confirm"); 
      expect(response.status).toBe(200);
    });
  }); */
})
