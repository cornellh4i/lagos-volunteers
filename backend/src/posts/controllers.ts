import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../prisma/seed";

/**
 * Create a new post
 * user details are passed in request body
 * @returns promise with all posts or error
 */

const createNewPost = async (req: Request, res: Response) => {
  const { title, content, authorEmail } = req.body;

  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } },
      },
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a post
 * @param user id contained in request params
 * @returns promise with deleted post or error
 */

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a specific posts
 * @param user id contained in request params
 * @returns promise with all post or error
 */

const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: { author: true },
    });
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Publish a new post.
 * @param post id contained in request params
 * @returns promise with post or error
 */
const publishPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { published: true },
    });
    res.status(200).json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all posts (must be published)
 * @returns promise with all posts or error
 * */

const getAllPublishedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createNewPost,
  deletePost,
  getPost,
  publishPost,
  getAllPublishedPosts,
};
