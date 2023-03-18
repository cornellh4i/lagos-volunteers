import { userRole } from "@prisma/client";
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
});

describe("Testing PUT /users/:userid/profile", () => {
  test("edit a user's profile with an existing and not existing fields", async () => {
    const user = {
      email: "testeditprof@gmail.com",
      role: "ADMIN",
      status: "ACTIVE",
      hours: 0,
      profile: {
        firstName: "Arizona",
        nickname: "99cents",
        imageURL: null,
        disciplinaryNotices: 0,
      },
    };

    const createdUser = await request(app).post("/users").send(user);
    const userid = createdUser.body.id;

    const editProfile = {
      firstName: "Arizona2",
      lastName: "Tea2",
    };

    const response = await request(app)
      .put("/users/" + userid + "/profile")
      .send(editProfile);

    const data = response.body;
    expect(data.profile.firstName).toBe("Arizona2");
    expect(data.profile.lastName).toBe("Tea2");
    expect(data.profile.nickname).toBe("99cents");
    expect(response.status).toBe(200);
  });
});

describe("Testing PUT /users/:userid/preferences", () => {
  test("edit a user's preferences with an existing and not existing fields", async () => {
    const user = {
      email: "testeditpref@gmail.com",
      preferences: {
        sendEmailNotification: true,
      },
    };

    const createdUser = await request(app).post("/users").send(user);

    const userid = createdUser.body.id;

    const editPreferences = {
      sendEmailNotification: false,
      sendPromotions: true,
    };

    const response = await request(app)
      .put("/users/" + userid + "/preferences")
      .send(editPreferences);

    const data = response.body;

    expect(data.preferences.sendEmailNotification).toBe(false);
    expect(data.preferences.sendPromotions).toBe(true);
    expect(data.preferences.userId).toBe(userid);
    expect(response.status).toBe(200);
  });
});

describe("Testing PATCH /users/:userid/status/:status", () => {
  test("PATCH edit a user's role with an existing role", async () => {
    // This is temporary till we create an endpoint to get a specific user
    const users = await request(app).get("/users");
    const userid = users.body[1].id;
    const response = await request(app).patch(
      "/users/" + userid + "/role" + "/SUPERVISOR"
    );
    const data = response.body;
    expect(data.role).toBe("SUPERVISOR");
    expect(response.status).toBe(200);
  });
});

describe("Testing PATCH /users/:userid/hours/:hours", () => {
  test("PATCH edit a user's hours with an existing hours", async () => {
    // This is temporary till we create an endpoint to get a specific user
    const users = await request(app).get("/users");
    const userid = users.body[1].id;
    const response = await request(app).patch(
      "/users/" + userid + "/hours" + "/10"
    );
    const data = response.body;
    expect(data.hours).toBe(10);
    expect(response.status).toBe(200);
  });
});

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

describe("Testing GET /users/:userid/profile", () => {
  test("GET user's profile", async () => {
    // This is temporary till we create an endpoint to get a specific user
    const users = await request(app).get("/users");
    const userid = users.body[0].id;

    const response = await request(app).get("/users/" + userid + "/profile");
    expect(response.status).toBe(200);
  });

  test("GET 2nd user's profile", async () => {
    const user = {
      email: "jdo583@cornell.edu",
    };

    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app).get("/users/" + userid + "/profile");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /users/:userid/role", () => {
  test("GET supervisor user's role", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app).get("/users/" + userid + "/role");
    expect(response.status).toBe(200);
  });

  test("GET user's default role", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[0].id;

    const response = await request(app).get("/users/" + userid + "/role");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /users/:userid/preferences", () => {
  test("GET user's default preferences", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[0].id;

    const response = await request(app).get(
      "/users/" + userid + "/preferences"
    );
    expect(response.status).toBe(200);
  });

  test("GET user's non-default preferences", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app).get(
      "/users/" + userid + "/preferences"
    );
    const data = response.body;
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /users/:userid/profile", () => {
  test("GET user's profile", async () => {
    // This is temporary till we create an endpoint to get a specific user
    const users = await request(app).get("/users");
    const userid = users.body[0].id;

    const response = await request(app).get("/users/" + userid + "/profile");
    expect(response.status).toBe(200);
  });

  test("GET 2nd user's profile", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app).get("/users/" + userid + "/profile");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /users/:userid/role", () => {
  test("GET supervisor user's role", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app).get("/users/" + userid + "/role");
    expect(response.status).toBe(200);
  });

  test("GET user's default role", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[0].id;

    const response = await request(app).get("/users/" + userid + "/role");
    expect(response.status).toBe(200);
  });
});

describe("Testing GET /users/:userid/preferences", () => {
  test("GET user's default preferences", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[0].id;

    const response = await request(app).get(
      "/users/" + userid + "/preferences"
    );
    expect(response.status).toBe(200);
  });

  test("GET user's non-default preferences", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[1].id;

    const response = await request(app).get(
      "/users/" + userid + "/preferences"
    );
    expect(response.status).toBe(200);
  });
});

describe("Testing /users/:userID", () => {
  test("GET same user after POST", async () => {
    const user = {
      email: "test@gmail.com",
    };

    const POSTresponse = await request(app).post("/users").send(user);
    const userID = POSTresponse.body.id;

    const GETresponse = await request(app).get("/users/" + userID);
    const data = GETresponse.body;
    expect(GETresponse.status).toBe(200);
    expect(data.email).toBe("test@gmail.com");
  });

  test("GET null user", async () => {
    const response = await request(app).get("/users/z");
    expect(response.status).toBe(500);
  });
});

describe("Testing /users/:userID/created", () => {
  test("GET createdEvents of user with created events", async () => {
    const POSTresponse = await request(app).get(
      "/users/search?firstName=Prisma"
    );
    const userID = POSTresponse.body[0].id;

    const GETresponse = await request(app).get("/users/" + userID + "/created");
    const data = GETresponse.body;
    expect(GETresponse.status).toBe(200);
  });

  test("GET createdEvents of null user", async () => {
    const response = await request(app).get("/users/z/created");
    expect(response.status).toBe(500);
  });
});

describe("Testing /users/:userID/registered", () => {
  test("GET registeredEvents of user with registered events", async () => {
    const POSTresponse = await request(app).get(
      "/users/search?firstName=Alice"
    );
    const userID = POSTresponse.body[0].id;

    const GETresponse = await request(app).get(
      "/users/" + userID + "/registered"
    );
    const data = GETresponse.body;
    expect(GETresponse.status).toBe(200);
    expect(data.length).toBe(1);
  });

  test("GET registeredEvents of null user", async () => {
    const response = await request(app).get("/users/z/registered");
    expect(response.status).toBe(500);
  });
});

describe("Testing /users/:userID/hours", () => {
  test("GET hours of user", async () => {
    const POSTresponse = await request(app).get(
      "/users/search?firstName=Prisma"
    );
    const userID = POSTresponse.body[0].id;

    const GETresponse = await request(app).get("/users/" + userID + "/hours");
    const data = GETresponse.body;
    expect(GETresponse.status).toBe(200);
    expect(data).toBe(0);
  });

  test("GET hours of null user", async () => {
    const response = await request(app).get("/users/z/hours");
    expect(response.status).toBe(500);
  });
});

/**
 * Because of the relationships that exist in our database, deleting a
 * user will also delete all of their associated data. But there is extra
 * configuration that needs to be done to delete a user. Will get back to this.
 */

describe("Testing DELETE user", () => {
  test("Delete valid user", async () => {
    // This is temporary till we create ann endpoint to get a specific user
    const users = await request(app).get("/users");
    const userid = users.body[0].id;
    const response = await request(app).delete("/users/" + userid);
    expect(response.status).toBe(200);
  });

  test("Delete invalid user", async () => {
    const userid = -1;
    const response = await request(app).delete("/users/" + userid);
    expect(response.status).toBe(500);
  });
});


describe("Testing GET /users/pagination", () => {
  
  test("Get 2 users after the second use", async () => {
    const users = await request(app).get("/users");
    const userid = users.body[1].id;
    const response = await request(app).get("/users/pagination?limit=2&after=" + userid);
    const data = response.body;
    expect(response.status).toBe(200);
    expect(data.length).toBe(2);
  });
  test("Get 10 users after the second use", async () => {
    // limit should be defaulted to 10
    const users = await request(app).get("/users");
    const userid = users.body[2].id;
    const response = await request(app).get("/users/pagination?after=" + userid);
    expect(response.status).toBe(200);
  });
});