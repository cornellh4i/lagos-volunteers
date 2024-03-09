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
const client_1 = __importDefault(require("../client"));
const date_fns_1 = require("date-fns");
const script_1 = require("../src/utils/script");
/**
 * This function is used to seed the database with dummy data.
 * It is used for testing purposes only.
 * @param pool - The number of users to create.
 */
const userDataSeed = [];
function createPoolOfRandomUsers(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = [];
        for (let i = 0; i < pool; i++) {
            users.push((0, script_1.createRandomUser)());
        }
        console.log(`Created ${users.length} random users`);
        for (const user of users) {
            const createdUser = yield client_1.default.user.create({
                data: {
                    email: user.email,
                    role: user.role,
                    profile: {
                        create: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            nickname: user.nickname,
                            imageURL: user.imageURL,
                            phoneNumber: user.phone,
                        },
                    },
                    preferences: {
                        create: {
                            sendPromotions: true,
                        },
                    },
                },
            });
            userDataSeed.push(createdUser);
        }
        console.log("Done creating pool of random users");
    });
}
const eventDataSeed = [];
/**
 * This function is used to seed the database with dummy event data.
 */
function createPoolOfRandomEvents(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        const events = [];
        for (let i = 0; i < pool; i++) {
            events.push((0, script_1.createRandomEvent)());
        }
        console.log(`Created ${events.length} random events`);
        const supervisors = [];
        // create 20 supervisors to host various events
        for (let i = 0; i < 20; i++) {
            const supervisor = (0, script_1.createRandomUser)();
            const createdSupervisor = yield client_1.default.user.create({
                data: {
                    email: supervisor.email,
                    role: "SUPERVISOR",
                    profile: {
                        create: {
                            firstName: supervisor.firstName,
                            lastName: supervisor.lastName,
                            nickname: supervisor.nickname,
                            imageURL: supervisor.imageURL,
                            phoneNumber: supervisor.phone,
                        },
                    },
                    preferences: {
                        create: {
                            sendPromotions: true,
                        },
                    },
                },
            });
            supervisors.push(createdSupervisor);
        }
        for (const event of events) {
            const randomSuperVisor = supervisors[Math.floor(Math.random() * 20)];
            const createdEvent = yield client_1.default.event.create({
                data: {
                    name: event.name,
                    description: event.description,
                    location: event.location,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    imageURL: event.imageURL,
                    owner: {
                        connect: {
                            id: randomSuperVisor.id,
                        },
                    },
                    capacity: event.capacity,
                },
            });
            // enroll users in this event
            const users = userDataSeed.slice(0, 60);
            for (const user of users) {
                const createdEventEnrollment = yield client_1.default.eventEnrollment.create({
                    data: {
                        event: {
                            connect: {
                                id: createdEvent.id,
                            },
                        },
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                });
            }
            eventDataSeed.push(createdEvent);
        }
        console.log("Done creating pool of random events");
    });
}
const userData = [
    {
        email: "alice@hey.com",
        profile: {
            create: {
                firstName: "Alice",
                lastName: "Smith",
                nickname: "Asmithy",
            },
        },
        preferences: {
            create: {
                sendPromotions: true,
            },
        },
    },
    {
        email: "grace@hey.com",
        profile: {
            create: {
                firstName: "Grace",
                lastName: "Vanderwaal",
                nickname: "Gracey",
            },
        },
        role: "SUPERVISOR",
    },
    {
        email: "prisma@hey.com",
        profile: {
            create: {
                firstName: "Prisma",
                lastName: "Solanke",
                nickname: "Destiny",
            },
        },
        role: "ADMIN",
    },
];
// Some sample dates
// const _FormatISO = formatISO(new Date());
const pastDate1 = (0, date_fns_1.formatISO)(new Date("2019-01-16"));
const pastDate2 = (0, date_fns_1.formatISO)(new Date("2019-01-17"));
const pastDate3 = (0, date_fns_1.formatISO)(new Date("2019-01-18"));
const futureDate1 = (0, date_fns_1.formatISO)(new Date("2077-01-16"));
const futureDate2 = (0, date_fns_1.formatISO)(new Date("2077-01-17"));
const futureDate3 = (0, date_fns_1.formatISO)(new Date("2077-01-18"));
const eventData = [
    {
        name: "Past Event 1",
        description: "Prisma Day is a one-day conference for developers who want to learn about Prisma, the open-source database toolkit for Node.js and TypeScript.",
        location: "Berlin",
        startDate: pastDate1,
        endDate: pastDate2,
        owner: {
            connect: {
                id: userData[1].id,
                email: userData[1].email,
            },
        },
        capacity: 100,
    },
    {
        name: "Past Event 2",
        description: "This is a past event.",
        location: "Tokyo",
        startDate: pastDate2,
        endDate: pastDate3,
        owner: {
            connect: {
                id: userData[1].id,
                email: userData[1].email,
            },
        },
        capacity: 10,
    },
    {
        name: "Current Event 1",
        description: "This is a current event.",
        location: "Paris",
        startDate: pastDate1,
        endDate: futureDate1,
        owner: {
            connect: {
                id: userData[1].id,
                email: userData[1].email,
            },
        },
        capacity: 10,
    },
    {
        name: "Current Event 2",
        description: "This is a current event.",
        location: "London",
        startDate: pastDate2,
        endDate: futureDate3,
        owner: {
            connect: {
                id: userData[1].id,
                email: userData[1].email,
            },
        },
        capacity: 20,
    },
    {
        name: "Future Event 1",
        description: "Welcome to Cyberpunk 2077",
        location: "Night City",
        startDate: futureDate1,
        endDate: futureDate2,
        owner: {
            connect: {
                id: userData[2].id,
                email: userData[2].email,
            },
        },
        capacity: 100,
    },
    {
        name: "Future Event 2",
        description: "Welcome to Cyberpunk 2077",
        location: "Day City",
        startDate: futureDate2,
        endDate: futureDate3,
        owner: {
            connect: {
                id: userData[2].id,
                email: userData[2].email,
            },
        },
        capacity: 50,
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Start seeding ...`);
        // This is for seeding purposes only. Everytime seed, we will get constraint errors becuause we are creating the same data again.
        yield client_1.default.event.deleteMany({});
        yield client_1.default.user.deleteMany({});
        for (const u of userData) {
            const user = yield client_1.default.user.create({
                data: u,
            });
        }
        for (const e of eventData) {
            const event = yield client_1.default.event.create({
                data: e,
            });
            const prisma_u = yield client_1.default.user.findFirst({
                where: {
                    email: "prisma@hey.com",
                },
            });
            // Enroll Prisma in all they didn't create
            if (event.ownerId !== (prisma_u === null || prisma_u === void 0 ? void 0 : prisma_u.id)) {
                console.log("Enrolling Prisma in event");
                yield client_1.default.eventEnrollment.create({
                    data: {
                        user: {
                            connect: { id: prisma_u === null || prisma_u === void 0 ? void 0 : prisma_u.id },
                        },
                        event: {
                            connect: { id: event.id },
                        },
                    },
                });
            }
        }
        yield createPoolOfRandomUsers(100);
        yield createPoolOfRandomEvents(100);
        console.log(`Seeded ${yield client_1.default.user.count()} users.`);
        console.log(`Seeded ${yield client_1.default.event.count()} events.`);
        console.log(`Seeding finished.`);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield client_1.default.$disconnect();
    process.exit(1);
}));
exports.default = client_1.default;
