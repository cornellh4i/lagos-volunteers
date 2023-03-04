import request from "supertest";
import app from "../src/index";
import prisma from "../client";



// beforeAll(async () => {
//   await prisma.$connect();
// });

// afterAll(async () => {
//   await prisma.$disconnect();
//   await app.set('connection', 'close')
// });

describe("Testing Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });


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
  // test("Create a new user", async () => {
  //   const user = {
  //     email: "johnw@gmail.com",
  //   };
  //   const response = await request(app).post("/user/signup").send(user);
  //   expect(response.status).toBe(201);
  // });
});

// TODO: Add Tests for post endpoints
