import { PrismaClient } from "@prisma/client";
import app from "../src/index";
import request from "supertest";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Testing user Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });

  test("Create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "johnnewnew@gmail.com",
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.status).toBe(201);
  });

  test("Get all users with profile in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });
});

// TODO: Add Tests for post endpoints