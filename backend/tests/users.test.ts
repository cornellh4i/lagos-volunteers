import request from "supertest";
import app from "../src/index";
import prisma from "../client";


// Testing users endpoints
describe("Testing Users Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });
});


// Testing events endpoints
describe("Testing All Events Endpoints", () => {
  test("Get all events in DB", async () => {
    const response = await request(app).get("/events/all");
    expect(response.status).toBe(200);
  });
});

describe("Testing Upcoming Events Endpoints", () => {
  test("Get all upcoming events in DB", async () => {
    const response = await request(app).get("/events/upcoming");
    expect(response.status).toBe(200);
  });
});

describe("Testing Current Events Endpoints", () => {
  test("Get all get current events in DB", async () => {
    const response = await request(app).get("/events/current");
    expect(response.status).toBe(200);
  });
});
describe("Testing Past Events Endpoints", () => {
  test("Get all past events in DB", async () => {
    const response = await request(app).get("/events/past");
    expect(response.status).toBe(200);
  });
});

// TODO: Add Tests for post endpoints
