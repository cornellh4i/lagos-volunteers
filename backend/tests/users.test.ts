import request from "supertest";
import app from "../src/server";


// Testing users endpoints
describe("Testing Users Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });
});

