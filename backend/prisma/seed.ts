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

  console.log(`Created ${users.length} random users`);

  for (const user of users) {
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

  // Create users with a an email that can be verified:

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: "lagosfoodbankdev@gmail.com",
      role: "ADMIN",
      profile: {
        create: {
          firstName: "Lagos",
          lastName: "Food Bank",
          nickname: "LFB",
          phoneNumber: "08012345678",
        },
      },
      preferences: {
        create: {
          sendPromotions: true,
        },
      },
    },
  });

  // Supervisor 
  const supervisor = await prisma.user.create({
    data: {
      email: "olumidetest@gmail.com",
      role: "SUPERVISOR",
      profile: {
        create: {
          firstName: "Olumide",
          lastName: "Ade",
          nickname: "Olu",
          phoneNumber: "08012345678",
        },
      },
      preferences: {
        create: {
          sendPromotions: true,
        },
      },
    },
  });

  // Volunteer
  const volunteer = await prisma.user.create({
    data: {
      email: "lagosfoodbankvolunteer@gmail.com",
      role: "VOLUNTEER",
      profile: {
        create: {
          firstName: "LFB",
          lastName: "Volunteer",
          nickname: "Volunteer",
          phoneNumber: "08012345678",
        },
      },
      preferences: {
        create: {
          sendPromotions: true,
        },
      },
    },
  });
  userDataSeed.push(admin, supervisor, volunteer);
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
  console.log(`Created ${events.length} random events`);
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
    const createdEvent = await prisma.event.create({
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
    eventDataSeed.push(createdEvent);
  }

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
  // This is for seeding purposes only. Everytime seed, we will get constraint errors becuause we are creating the same data again.
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
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
  }

  await createPoolOfRandomUsers(100);
  await createPoolOfRandomEvents(100);

  console.log(`Seeded ${await prisma.user.count()} users.`);
  console.log(`Seeded ${await prisma.event.count()} events.`);
  console.log(`Seeding finished.`);
}

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
