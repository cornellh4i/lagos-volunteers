import { Prisma } from "@prisma/client";
import prisma from "../client";
import { formatISO } from "date-fns";
import {
  createRandomUser,
  createRandomEvent,
  dummyUser,
  dummyEvent,
} from "../src/utils/script";
import { User, Event } from "@prisma/client";

/**
 * This function is used to seed the database with dummy data.
 * It is used for testing purposes only.
 * @param pool - The number of users to create.
 */

const userDataSeed: User[] = [];

async function createPoolOfRandomUsers(pool: number) {
  const users: dummyUser[] = [];
  for (let i = 0; i < pool; i++) {
    users.push(createRandomUser());
  }

  users.map(async (user) => {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        role: user.role,
        profile: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            imageURL: user.imageURL,
          },
        },
        preferences: {
          create: {
            sendPromotions: true,
          },
        },
      },
    });
    console.log(`Created user with id: ${createdUser.id}`);
    userDataSeed.push(createdUser);
  });
  console.log("Done creating pool of random users");
}

const eventDataSeed: Event[] = [];
/**
 * This function is used to seed the database with dummy event data.
 */
async function createPoolOfRandomEvents(pool: number) {
  const events: dummyEvent[] = [];
  for (let i = 0; i < pool; i++) {
    events.push(createRandomEvent());
  }
  const supervisors: User[] = [];
  // create 20 supervisors to host various events
  for (let i = 0; i < 20; i++) {
    const supervisor = createRandomUser();
    const createdSupervisor = await prisma.user.create({
      data: {
        email: supervisor.email,
        role: "SUPERVISOR",
        profile: {
          create: {
            firstName: supervisor.firstName,
            lastName: supervisor.lastName,
            nickname: supervisor.nickname,
            imageURL: supervisor.imageURL,
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
  events.map(async (event, index) => {
    const randomSuperVisor = supervisors[Math.floor(Math.random() * 20)];
    const createdEvent = await prisma.event.create({
      data: {
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
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
      const createdEventEnrollment = await prisma.eventEnrollment.create({
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
    console.log(`Created event with id: ${createdEvent.id}`);
    eventDataSeed.push(createdEvent);
  });

  console.log("Done creating pool of random events");
}

const userData: Prisma.UserCreateInput[] = [
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
const pastDate1 = formatISO(new Date("2019-01-16"));
const pastDate2 = formatISO(new Date("2019-01-17"));
const pastDate3 = formatISO(new Date("2019-01-18"));
const futureDate1 = formatISO(new Date("2077-01-16"));
const futureDate2 = formatISO(new Date("2077-01-17"));
const futureDate3 = formatISO(new Date("2077-01-18"));

const eventData: Prisma.EventCreateInput[] = [
  {
    name: "Past Event 1",
    description:
      "Prisma Day is a one-day conference for developers who want to learn about Prisma, the open-source database toolkit for Node.js and TypeScript.",
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

async function main() {
  console.log(`Start seeding ...`);

  await prisma.eventEnrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.userPreferences.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.user.deleteMany({});

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const e of eventData) {
    const event = await prisma.event.create({
      data: e,
    });

    const prisma_u = await prisma.user.findFirst({
      where: {
        email: "prisma@hey.com",
      },
    });

    // Enroll Prisma in all they didn't create
    if (event.ownerId !== prisma_u?.id) {
      console.log("Enrolling Prisma in event");
      await prisma.eventEnrollment.create({
        data: {
          user: {
            connect: { id: prisma_u?.id },
          },
          event: {
            connect: { id: event.id },
          },
        },
      });
    }

    console.log(`Created event with id: ${event.id}`);
  }

  await createPoolOfRandomUsers(100);
  await createPoolOfRandomEvents(100);

  console.log(`Seeding finished.`);
}
// This is for demo purposes only. Everytime we start the server, our seed script will run.
// But, we will get constraint errors becuause we are creating the same data again.

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export default prisma;
