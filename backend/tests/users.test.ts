import { PrismaClient } from "@prisma/client";
import express, { Application } from "express";
import request from "supertest";
import app from "../src/index";
import prisma from "../client";
import { Server } from "http";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.set("connection", "close");
});

describe("Testing user Endpoints", () => {
  // test("Get all users in DB", async () => {
  //   const response = await request(app).get("/users");
  //   expect(response.status).toBe(200);
  //   let users = Array.isArray(response.body) ? response.body : [];
  //   users.forEach((user) => {
  //     expect(user).toHaveProperty("id");
  //     expect(user).toHaveProperty("email");
  //     expect(user).toHaveProperty("name");

  //     if (user.profile) {
  //       // Check if the profile exists and validate its structure
  //       expect(user.profile).toHaveProperty("id");
  //       expect(user.profile).toHaveProperty("bio");
  //       expect(user.profile).toHaveProperty("following");
  //       expect(user.profile).toHaveProperty("followers");
  //       expect(user.profile).toHaveProperty("createdAt");
  //       expect(user.profile).toHaveProperty("updatedAt");
  //       expect(user.profile).toHaveProperty("userId");
  //     } else {
  //       // Ensure the profile is explicitly null if no profile is associated
  //       expect(user.profile).toBeNull();
  //     }
  //   });
  // });

  test("Create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "johnw@gmail.com",
    };
    const response = await request(app).post("/user/signup").send(user);
    expect(response.status).toBe(201);
  });
});

// TODO: Add Tests for post endpoints
