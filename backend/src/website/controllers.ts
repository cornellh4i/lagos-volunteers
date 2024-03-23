import { Request, Response, query } from "express";
import { Prisma, userRole, UserStatus } from "@prisma/client";
import { User, Profile, Permission, UserPreferences } from "@prisma/client";
import admin from "firebase-admin";
// We are using one connection to prisma client to prevent multiple connections
import prisma from "../../client";
import { setVolunteerCustomClaims } from "../middleware/auth";

const getAllEvents = async () => {
  return prisma.event.findMany({
    include: {
      attendees: true,
      tags: true
    }
})
}

export default {getAllEvents};