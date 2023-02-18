import { PrismaClient } from "@prisma/client";
import express, {Application} from "express";
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
      name: "John Doe",
      email: "johndoe@gmail.com",
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.status).toBe(201);
  });

  test("Get users including Profile", async () => {
    const response = await request(app).get("/users"); 
    expect(response.status).toBe(200); 
  });
});

// TODO: Add Tests for post endpoints
