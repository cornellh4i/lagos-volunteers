import request from "supertest";
import app from "../src/server";


// Testing users endpoints
describe("Testing Users Endpoints", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });
});

describe("Testing users search", () => {
  test("GET users with status=ACTIVE", async () => {
    const response = await request(app).get("/users/search?status=ACTIVE");
    expect(response.status).toBe(200);
  });

  test("GET users with firstName=Alice", async () => {
    const response = await request(app).get("/users/search?firstName=Alice");
    const data =  response.body;
    for (let i = 0; i < data.length; i++) {
      expect(data[i].profile.firstName).toBe("Alice");
    }
    expect(response.status).toBe(200);
  });

  test("GET users with role=ADMIN", async () => {
    const response = await request(app).get("/users/search?role=ADMIN");
    const data =  response.body;
    for (let i = 0; i < data.length; i++) {
      expect(data[i].role).toBe("ADMIN");
    }
    expect(response.status).toBe(200);
  });

  test("GET users with hours=0", async () => {
    const response = await request(app).get("/users/search?hours=0");
    const data =  response.body;
    for (let i = 0; i < data.length; i++) {
      expect(data[i].hours).toBe(0);
    }

    expect(response.status).toBe(200);
  });

  test("GET users with hours=0&firstName=Alice", async () => {
    const response = await request(app).get("/users/search?hours=0&firstName=Alice");
    const data =  response.body;
  
    for (let i = 0; i < data.length; i++) {
      expect(data[i].hours).toBe(0);
      expect(data[i].profile.firstName).toBe("Alice");
    }
    expect(response.status).toBe(200);
  });

  test("GET users with hours=0&firstName=Alice&status=ACTIVE", async () => {
    const response = await request(app).get("/users/search?hours=0&firstName=Alice&status=ACTIVE");
    const data =  response.body;
  
    for (let i = 0; i < data.length; i++) {
      expect(data[i].hours).toBe(0);
      expect(data[i].profile.firstName).toBe("Alice");
      expect(data[i].status).toBe("ACTIVE");
    }
    expect(response.status).toBe(200);
  });

});

describe("Testing user creation", () => {
  test("POST Create a new user", async () => {
    const user = {
      email: "desi@gmail.com",
      role: "ADMIN",
    };
    const response = await request(app).post("/users/signup").send(user);
    const data = response.body;
    expect(data.email).toBe("desi@gmail.com");
    expect(data.role).toBe("ADMIN");

    expect(response.status).toBe(201);
  
  })

  test("POST Create a new user with empty email", async () => {
    const user ={}
    const response = await request(app).post("/users/signup").send(user);
    expect(response.status).toBe(500);
  })

});






