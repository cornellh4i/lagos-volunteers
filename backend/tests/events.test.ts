import request from "supertest";
import app from "../src/index";
import prisma from "../client";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.set('connection', 'close')
});

describe("Testing events Endpoints", () => {
  test("Get all events in DB", async () => {
    const response = await request(app).get("/event/all");
    expect(response.status).toBe(200);
  });
  
  test("Get all upcoming events in DB", async () => {
    const response = await request(app).get("/event/upcoming");
    expect(response.status).toBe(200);
  });

  test("Get all get current events in DB", async () => {
    const response = await request(app).get("/event/current");
    expect(response.status).toBe(200);
  });

  test("Get all past events in DB", async () => {
    const response = await request(app).get("/event/past");
    expect(response.status).toBe(200);
  });

});


