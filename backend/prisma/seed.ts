import { Prisma } from "@prisma/client";
import prisma from "../client";
import { formatISO } from "date-fns";

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
        id: userData[2].id,
        email: userData[2].email,
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
        id: userData[2].id,
        email: userData[2].email,
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
        id: userData[2].id,
        email: userData[2].email,
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
        id: userData[2].id,
        email: userData[2].email,
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

// Enroll Alice in Prisma Day

async function enrollAlice() {
  const alice = await prisma.user.findFirst({
    where: {
      id: userData[1].id,
    },
  });

  const event = await prisma.event.findFirst({
    where: {
      id: eventData[0].id,
    },
  });

  await prisma.eventEnrollment.create({
    data: {
      user: {
        connect: { id: alice?.id },
      },
      event: {
        connect: { id: event?.id },
      },
    },
  });
}

async function main() {
  console.log(`Start seeding ...`);

  await prisma.eventEnrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.userPreferences.deleteMany({});
  await prisma.profile.deleteMany({});
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
    console.log(`Created event with id: ${event.id}`);
  }
  await enrollAlice();
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
