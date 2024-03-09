"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../src/server"));
// Testing users endpoints
describe("Testing GET /users", () => {
    test("Get all users in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users");
        expect(response.status).toBe(200);
    }));
});
describe("Testing POST /users", () => {
    test("POST Create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: "desi2@gmail.com",
            role: "ADMIN",
        };
        const response = yield (0, supertest_1.default)(server_1.default).post("/users").send(user);
        const data = response.body.data;
        expect(data.email).toBe("desi2@gmail.com");
        expect(data.role).toBe("ADMIN");
        expect(response.status).toBe(201);
    }));
    test("POST Create a new user with empty email", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {};
        const response = yield (0, supertest_1.default)(server_1.default).post("/users").send(user);
        expect(response.status).toBe(500);
    }));
});
describe("Testing PUT /users/:userid", () => {
    test("Successfully update user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: "asu284@cornell.edu",
        };
        // This is temporary till we create an endpoint to get a specific user
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=10");
        const userid = users.body.data.result[9].id;
        const response = yield (0, supertest_1.default)(server_1.default)
            .put("/users/" + userid)
            .send(user);
        const data = response.body.data;
        expect(data.email).toBe("asu284@cornell.edu");
        expect(response.status).toBe(200);
    }));
});
describe("Testing PUT /users/:userid/profile", () => {
    test("edit a user's profile with an existing and not existing fields", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const createdUser = yield (0, supertest_1.default)(server_1.default).post("/users").send(user);
        const userid = createdUser.body.data.id;
        const editProfile = {
            firstName: "Arizona2",
            lastName: "Tea2",
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .put("/users/" + userid + "/profile")
            .send(editProfile);
        const data = response.body.data;
        expect(data.profile.firstName).toBe("Arizona2");
        expect(data.profile.lastName).toBe("Tea2");
        expect(data.profile.nickname).toBe("99cents");
        expect(response.status).toBe(200);
    }));
});
describe("Testing PUT /users/:userid/preferences", () => {
    test("edit a user's preferences with an existing and not existing fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: "testeditpref@gmail.com",
            preferences: {
                sendEmailNotification: true,
            },
        };
        const createdUser = yield (0, supertest_1.default)(server_1.default).post("/users").send(user);
        const userid = createdUser.body.data.id;
        const editPreferences = {
            sendEmailNotification: false,
            sendPromotions: true,
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .put("/users/" + userid + "/preferences")
            .send(editPreferences);
        const data = response.body.data;
        expect(data.preferences.sendEmailNotification).toBe(false);
        expect(data.preferences.sendPromotions).toBe(true);
        expect(data.preferences.userId).toBe(userid);
        expect(response.status).toBe(200);
    }));
});
describe("Testing PATCH /users/:userid/role", () => {
    test("PATCH edit a user's role with an existing role", () => __awaiter(void 0, void 0, void 0, function* () {
        // This is temporary till we create an endpoint to get a specific user
        const users = yield (0, supertest_1.default)(server_1.default).get("/users");
        const userid = users.body.data.result[9].id;
        const response = yield (0, supertest_1.default)(server_1.default)
            .patch("/users/" + userid + "/role")
            .send({ role: "SUPERVISOR" });
        const data = response.body.data;
        expect(data.role).toBe("SUPERVISOR");
        expect(response.status).toBe(200);
    }));
});
describe("Testing PATCH /users/:userid/status", () => {
    test("PATCH edit a user's status with an existing status", () => __awaiter(void 0, void 0, void 0, function* () {
        // This is temporary till we create an endpoint to get a specific user
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=10");
        const userid = users.body.data.result[9].id;
        const response = yield (0, supertest_1.default)(server_1.default)
            .patch("/users/" + userid + "/status")
            .send({ status: "INACTIVE" });
        const data = response.body.data;
        expect(data.status).toBe("INACTIVE");
        expect(response.status).toBe(200);
    }));
});
describe("Testing PATCH /users/:userid/hours", () => {
    test("PATCH edit a user's hours with an existing hours", () => __awaiter(void 0, void 0, void 0, function* () {
        // This is temporary till we create an endpoint to get a specific user
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=10");
        const userid = users.body.data.result[9].id;
        const response = yield (0, supertest_1.default)(server_1.default)
            .patch("/users/" + userid + "/hours")
            .send({ hours: 10 });
        const data = response.body.data;
        expect(data.hours).toBe(10);
        expect(response.status).toBe(200);
    }));
});
describe("Testing /users/search", () => {
    test("GET users with status=ACTIVE", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/search?status=ACTIVE");
        expect(response.status).toBe(200);
    }));
    test("GET users with firstName=Alice", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/search?firstName=Alice");
        const data = response.body.data;
        for (let i = 0; i < data.length; i++) {
            expect(data[i].profile.firstName).toBe("Alice");
        }
        expect(response.status).toBe(200);
    }));
    test("GET users with role=ADMIN", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/search?role=ADMIN");
        const data = response.body.data;
        for (let i = 0; i < data.length; i++) {
            expect(data[i].role).toBe("ADMIN");
        }
        expect(response.status).toBe(200);
    }));
    test("GET users with hours=0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/search?hours=0");
        const data = response.body.data;
        for (let i = 0; i < data.length; i++) {
            expect(data[i].hours).toBe(0);
        }
        expect(response.status).toBe(200);
    }));
    test("GET users with hours=0&firstName=Alice", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/search?hours=0&firstName=Alice");
        const data = response.body.data;
        for (let i = 0; i < data.length; i++) {
            expect(data[i].hours).toBe(0);
            expect(data[i].profile.firstName).toBe("Alice");
        }
        expect(response.status).toBe(200);
    }));
    test("GET users with hours=0&firstName=Alice&status=ACTIVE", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/search?hours=0&firstName=Alice&status=ACTIVE");
        const data = response.body.data;
        for (let i = 0; i < data.length; i++) {
            expect(data[i].hours).toBe(0);
            expect(data[i].profile.firstName).toBe("Alice");
            expect(data[i].status).toBe("ACTIVE");
        }
        expect(response.status).toBe(200);
    }));
});
describe("Testing GET /users/:userid/profile", () => {
    test("GET user's profile", () => __awaiter(void 0, void 0, void 0, function* () {
        // This is temporary till we create an endpoint to get a specific user
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=10");
        const userid = users.body.data.result[9].id;
        const userProfile = users.body.data.result[9].profile;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/" + userid + "/profile");
        expect(response.status).toBe(200);
        expect(response.body.data.profile.firstName).toEqual(userProfile.firstName);
        expect(response.body.data.profile.lastName).toEqual(userProfile.lastName);
    }));
});
describe("Testing GET /users/:userid/role", () => {
    test("GET supervisor user's role", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=2");
        const userid = users.body.data.result[1].id;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/" + userid + "/role");
        expect(response.status).toBe(200);
    }));
    test("GET user's default role", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=2");
        const userid = users.body.data.result[0].id;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/" + userid + "/role");
        expect(response.status).toBe(200);
    }));
});
describe("Testing GET /users/:userid/preferences", () => {
    test("GET user's default preferences", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=2");
        const userid = users.body.data.result[0].id;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/" + userid + "/preferences");
        expect(response.status).toBe(200);
    }));
    test("GET user's non-default preferences", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=2");
        const userid = users.body.data.result[1].id;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/" + userid + "/preferences");
        const data = response.body.data;
        expect(response.status).toBe(200);
    }));
});
describe("Testing /users/:userID", () => {
    test("GET same user after POST", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: "test@gmail.com",
        };
        const POSTresponse = yield (0, supertest_1.default)(server_1.default).post("/users").send(user);
        const userID = POSTresponse.body.data.id;
        const GETresponse = yield (0, supertest_1.default)(server_1.default).get("/users/" + userID);
        const data = GETresponse.body.data;
        expect(GETresponse.status).toBe(200);
        expect(data.email).toBe("test@gmail.com");
    }));
    test("GET null user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/z");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(null);
    }));
});
describe("Testing /users/sorting/", () => {
    test("GET users sorted by firstName in ascending order with null profiles", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/?sort=firstName:asc");
        const data = response.body.data.result;
        expect(data[0].profile.firstName >= data[1].profile.firstName);
        expect(response.status).toBe(200);
    }));
    test("GET users sorted by firstName in descending order with null profiles", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users?sort=firstName:desc");
        const data = response.body.data.result;
        expect(data[0].profile == null); //any null profiles should show up first
        expect(data[0].profile.firstName <= data[1].profile.firstName);
        expect(response.status).toBe(200);
    }));
    test("GET users sorted by hours in descending order", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users?sort=hours:desc");
        const data = response.body.data.result;
        expect(data[0].hours <= data[1].hours);
        expect(response.status).toBe(200);
    }));
    test("GET users sorted by email in ascending order", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users?sort=email:asc");
        const data = response.body.data.result;
        expect(data[0].email <= data[1].email);
        expect(response.status).toBe(200);
    }));
});
describe("Testing /users/:userID/created", () => {
    test("GET createdEvents of user with created events", () => __awaiter(void 0, void 0, void 0, function* () {
        const POSTresponse = yield (0, supertest_1.default)(server_1.default).get("/users?firstName=Prisma");
        const userID = POSTresponse.body.data.result[0].id;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/" + userID + "/created");
        expect(response.status).toBe(200);
    }));
    test("GET createdEvents of null user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/z/created");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(null);
    }));
});
describe("Testing /users/:userID/registered", () => {
    test("GET registeredEvents of user with registered events", () => __awaiter(void 0, void 0, void 0, function* () {
        const POSTresponse = yield (0, supertest_1.default)(server_1.default).get("/users?firstName=Alice");
        const userID = POSTresponse.body.data.result[0].id;
        const GETresponse = yield (0, supertest_1.default)(server_1.default).get("/users?userId=" + userID);
        expect(GETresponse.status).toBe(200);
    }));
    test("GET registeredEvents of null user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/z/registered");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(null);
    }));
});
describe("Testing /users/:userID/hours", () => {
    test("GET hours of user", () => __awaiter(void 0, void 0, void 0, function* () {
        const POSTresponse = yield (0, supertest_1.default)(server_1.default).get("/users?firstName=Prisma");
        const userID = POSTresponse.body.data.result[0].id;
        const GETresponse = yield (0, supertest_1.default)(server_1.default).get("/users/" + userID + "/hours");
        const data = GETresponse.body.data;
        expect(GETresponse.status).toBe(200);
        expect(data.hours).toBe(0);
    }));
    test("GET hours of null user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/z/hours");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(null);
    }));
});
describe("Testing GET /users/pagination", () => {
    test("Get 2 users after the second use", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=3");
        const cursor = users.body.data.cursor;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users?limit=2&after=" + cursor);
        const data = response.body.data.result;
        expect(response.status).toBe(200);
        expect(data.length).toBe(2);
    }));
    test("Pagination without /pagination", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users?limit=3");
        const data = users.body.data;
        expect(users.status).toBe(200);
        expect(data.result.length).toBe(3);
    }));
    test("Get 10 users after the second use", () => __awaiter(void 0, void 0, void 0, function* () {
        // limit should be defaulted to 10
        const users = yield (0, supertest_1.default)(server_1.default).get("/users");
        const cursor = users.body.data.cursor;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users?after=" + cursor);
        expect(response.status).toBe(200);
        expect(users.body.data.result.length).toBe(10);
        expect(response.body.data.result.length).toBe(10);
        // check that next fecth with cursor is different from prev
        expect(users.body.data.result[0].id).not.toBe(response.body.data.result[0].id);
    }));
    test("Get 10 users without a specified after", () => __awaiter(void 0, void 0, void 0, function* () {
        // limit should be defaulted to 10
        const users = yield (0, supertest_1.default)(server_1.default).get("/users");
        const userid = users.body.data.result[2].id;
        const response = yield (0, supertest_1.default)(server_1.default).get("/users/pagination");
        expect(response.status).toBe(200);
    }));
});
/** Note: Deleting a user still needs to be extensively tested. */
describe("Testing DELETE /users/:userid", () => {
    test("Delete valid user", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(server_1.default).get("/users");
        const userid = users.body.data.result[0].id;
        const response = yield (0, supertest_1.default)(server_1.default).delete("/users/" + userid);
        expect(response.status).toBe(200);
        const getResponse = yield (0, supertest_1.default)(server_1.default).get("/users/" + userid);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.data).toEqual(null);
    }));
    test("Delete invalid user", () => __awaiter(void 0, void 0, void 0, function* () {
        const userid = -1;
        const response = yield (0, supertest_1.default)(server_1.default).delete("/users/" + userid);
        expect(response.status).toBe(500);
    }));
});
