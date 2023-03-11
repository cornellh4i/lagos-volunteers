import request from "supertest";
import app from "../src/server";

// Testing users endpoints
describe("Testing GET /users", () => {
  test("Get all users in DB", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });
});

describe("Testing POST /users", () => {
  test("POST Create a new user", async () => {
    const user = {
      email: "desi2@gmail.com",
      role: "ADMIN",
    };
    const response = await request(app).post("/users").send(user);
    const data = response.body;
    expect(data.email).toBe("desi2@gmail.com");
    expect(data.role).toBe("ADMIN");

    expect(response.status).toBe(201);
  });

  test("POST Create a new user with empty email", async () => {
    const user = {};
    const response = await request(app).post("/users").send(user);
    expect(response.status).toBe(500);
  });
});

describe("Testing PUT /users/:userid", () => {
  test("Successfully update user", async () => {
    const user = {
      email: "asu284@cornell.edu",
    };

    // This is temporary till we create an endpoint to get a specific user
    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app)
      .put("/users/" + userid)
      .send(user);
    const data = response.body;
    expect(data.email).toBe("asu284@cornell.edu");
    expect(response.status).toBe(200);
  });
  test("Successfully update user", async () => {
    const user = {
      email: "asu284@cornell.edu",
    };
  });
});

/**
 * Because of the relationships that exist in our database, deleting a
 * user will also delete all of their associated data. But there is extra
 * configuration that needs to be done to delete a user. Will get back to this.
 */

// describe ("Testing DELETE user",() => {

//   test("Delete valid user", async () => {

//     // This is temporary till we create ann endpoint to get a specific user
//     const users  = await request(app).get("/users/all");
//     const userid = users.body[0].id;
//     const response = await request(app).delete("/users/"+ userid);
//     console.log(response.error)
//     expect(response.status).toBe(200);
//   });

//   test("Delete invalid user", async () => {
//     const userid = -1
//     const response = await request(app).delete("/users/" + userid);
//     expect(response.status).toBe(500);
//   })
// });

describe("Testing /users/search", () => {
  test("GET users with status=ACTIVE", async () => {
    const response = await request(app).get("/users/search?status=ACTIVE");
    expect(response.status).toBe(200);
  });

  test("GET users with firstName=Alice", async () => {
    const response = await request(app).get("/users/search?firstName=Alice");
    const data = response.body;
    for (let i = 0; i < data.length; i++) {
      expect(data[i].profile.firstName).toBe("Alice");
    }
    expect(response.status).toBe(200);
  });

  test("GET users with role=ADMIN", async () => {
    const response = await request(app).get("/users/search?role=ADMIN");
    const data = response.body;
    for (let i = 0; i < data.length; i++) {
      expect(data[i].role).toBe("ADMIN");
    }
    expect(response.status).toBe(200);
  });

  test("GET users with hours=0", async () => {
    const response = await request(app).get("/users/search?hours=0");
    const data = response.body;
    for (let i = 0; i < data.length; i++) {
      expect(data[i].hours).toBe(0);
    }

    expect(response.status).toBe(200);
  });

  test("GET users with hours=0&firstName=Alice", async () => {
    const response = await request(app).get(
      "/users/search?hours=0&firstName=Alice"
    );
    const data = response.body;

    for (let i = 0; i < data.length; i++) {
      expect(data[i].hours).toBe(0);
      expect(data[i].profile.firstName).toBe("Alice");
    }
    expect(response.status).toBe(200);
  });

  test("GET users with hours=0&firstName=Alice&status=ACTIVE", async () => {
    const response = await request(app).get(
      "/users/search?hours=0&firstName=Alice&status=ACTIVE"
    );
    const data = response.body;

    for (let i = 0; i < data.length; i++) {
      expect(data[i].hours).toBe(0);
      expect(data[i].profile.firstName).toBe("Alice");
      expect(data[i].status).toBe("ACTIVE");
    }
    expect(response.status).toBe(200);
  });
});
