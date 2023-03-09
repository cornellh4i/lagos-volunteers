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

describe("Testing get all users Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });
});

describe("Testing users Endpoints", () => {
  test("Get users with status=ACTIVE", async () => {
    const response = await request(app).get("/users/search?status=ACTIVE");
    expect(response.status).toBe(200);
  });

  test("Get users with firstName=Alice", async () => {
    const response = await request(app).get("/users/search?firstName=Alice");
    expect(response.status).toBe(200);
  });

  test("Get users with role=ADMIN", async () => {
    const response = await request(app).get("/users/search?role=ADMIN");
    expect(response.status).toBe(200);
  });

  test("Get users with hours=0", async () => {
    const response = await request(app).get("/users/search?hours=0");
    expect(response.status).toBe(200);
  });

  test("Get users with hours=0&firstName=Alice", async () => {
    const response = await request(app).get("/users/search?hours=0&firstName=Alice");
    expect(response.status).toBe(200);
  });


  /* user tests*/

  //   test("Create a new user", async () => {
  //     const user = {
  //       email: "johnw@gmail.com",
  //     };
  //     const response = await request(app).post("/user/signup").send(user);
  //     expect(response.status).toBe(201);
  //   });
});

// TODO: Add Tests for post endpoints
