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
