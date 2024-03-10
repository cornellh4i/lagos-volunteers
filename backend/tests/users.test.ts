import { PrismaClient } from "@prisma/client";
import express, { Application } from "express";
import request from "supertest";
import app from "../src/index";
import prisma from "../client";
import { Console } from "console";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.set("connection", "close");
});

describe("Testing user Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });

  test("Create a new user", async () => {
    const user = {
      name: "Eric V5",
      email: "eric5@gmail.com",
    };
    const response = await request(app).post("/user/signup").send(user);
    const data = response.body;
    console.log(response.body);
    expect(data.name).toBe("Eric V5");
    expect(data.email).toBe("eric5@gmail.com");
    expect(response.status).toBe(201);
  });
});

// TODO: Add Tests for post endpoints
