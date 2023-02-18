import { Prisma } from "@prisma/client";
import prisma from "../client";
import { formatISO } from 'date-fns';

const userData: Prisma.UserCreateInput[] = [
  {
    email: "alice@hey.com",
    profile:{
      create:{
        firstName: "Alice",
        lastName: "Smith",
        nickname: "Asmithy",
      }
    },
    preferences:{
        create:{
          sendPromotions: true,
        }
    }
  },
  {
    email: "grace@hey.com",
    profile:{
      create:{
        firstName: "Grace",
        lastName: "Vanderwaal",
        nickname: "Gracey",
      }
    },
    role: "SUPERVISOR"

  },
  {
    email: "prisma@hey.com",
    profile:{
      create:{
        firstName: "Prisma",
        lastName: "Solanke",
        nickname: "Destiny",
      }
    },
    role: "ADMIN"

  },

]

// Some random date
const _FormatISO = formatISO(new Date());


const eventData: Prisma.EventCreateInput[] = [

  {
    name: "Prisma Day",
    description: "Prisma Day is a one-day conference for developers who want to learn about Prisma, the open-source database toolkit for Node.js and TypeScript.",
    location: "Berlin",
    startDate: _FormatISO,
    endDate: _FormatISO,
    owner:{connect:
          {
            id: userData[2].id,
            email: userData[2].email
          },
    },
    capacity: 100,
  }
]


// Enroll Alice in Prisma Day

async function enrollAlice(){
  const alice = await prisma.user.findFirst({
    where:{
      id: userData[1].id
    }
  })

  const event = await prisma.event.findFirst({
    where:{
      id: eventData[0].id
    }
  })

  await prisma.eventEnrollment.create({
     data:{
          user:{
            connect:{ id: alice?.id }
          },
       event:{
            connect:{ id: event?.id }
       }
     }
  })

  // try {
  //   const result = await prisma.user.update({
  //     where:{
  //       id: alice?.id
  //     },
  //     data:{
  //       events:{
  //           create:{
  //             event:{
  //               connect:{ id: event?.id }
  //             }
  //           }
  //       }
  //     }
  //   })
  //
  // }catch (err: any) {
  //   console.log(err)
  // }
}

async function main() {
  console.log(`Start seeding ...`)

  await prisma.eventEnrollment.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.userPreferences.deleteMany({})
  await prisma.profile.deleteMany({})
  await prisma.user.deleteMany({})
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  for (const e of eventData) {
    const event = await prisma.event.create({
        data: e,
    })
    console.log(`Created event with id: ${event.id}`)

    }
  await enrollAlice()
  console.log(`Seeding finished.`)
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
