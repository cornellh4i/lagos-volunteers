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

describe("Testing user Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });

  test("Create a new user", async () => {
    const user = {
      email: "johnw@gmail.com",
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.status).toBe(201);
  });


  test("Create a new user", async () => {
    const user = {
      email: "alw284@cornell.edu",
      profile: {
        create: {
          firstName: "Anya",
          lastName: "Wang",
          nickname: "Sheep",
        }
      },
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.status).toBe(201);
  });

  test("Fail to create a new user", async () => {
    const user = {

    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.status).toBe(500);
  });

  test("Successfully update user", async () => { //F
    const user = {
      email: "asu284@cornell.edu",
    };
    const userid = "clexnw7p60002hd5hlwaiyqvk"
    const response = await request(app).put("/user/update/:" + userid).send(user);
    expect(response.status).toBe(200);
  });

  test("Update user fail", async () => {
    const user = {
      email: "asu284@cornell.edu",
    };
    const userid = -1
    const response = await request(app).put("/user/update/" + userid).send(user);
    expect(response.status).toBe(404);
  })

  test("Delete valid user", async () => { //F
    const userid = "clexnw7p60002hd5hlwaiyqvk";
    const response = await request(app).delete("/user/delete/:" + userid);
    expect(response.status).toBe(200);
  });

  test("Delete invalid user", async () => {
    const userid = -1
    const response = await request(app).delete("/user/delete/:" + userid);
    expect(response.status).toBe(404);
  });
});

// TODO: Add Tests for post endpoints
