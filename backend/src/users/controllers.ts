import { Prisma, PrismaClient } from "@prisma/client";

/** Note: In the future, we would need to create one
 * instance of Prisma client and then import in other files */

const prisma = new PrismaClient();

/**
 * Finds all users in DB
 * @returns promise with all users or error
 */
const getUsers = async () => await prisma.user.findMany();

/**
 * Sign up a new user
 * @param id customer id
 * @param userDetails is user details. See type below
 * @returns promise with user or error
 */

type User = {
  name: string;
  email: string;
  posts: [];
};
const createNewUser = async (userDetails: User) => {
  const { name, email, posts } = userDetails;

  const postData = userDetails.posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content };
  });

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        posts: {
          create: postData,
        },
      },
    });

    return result;
  } catch (err) {
    console.log(err);
  }
};

export default {
  getUsers,
  createNewUser,
};
