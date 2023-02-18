import { Prisma } from "@prisma/client";
import prisma from "../client";

const userData: Prisma.UserCreateInput[] = [

]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
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
