import { Response } from "express";
import { errorJson, successJson } from "./jsonResponses";
import admin from "firebase-admin";
import { User } from "@prisma/client";
import deleteUser from "../users/controllers";
import prisma from "../../client";
import { WebSocket } from "ws";
import { wss } from "..";

/**
 * Attempts the given controller and sends a success code or error code as necessary
 * @param successCode is the success code
 * @param controller is the function called from the controller
 */
export const attempt = async (
  res: Response,
  successCode: number,
  controller: () => Promise<any>
) => {
  try {
    res.status(successCode).send(successJson(await controller()));
  } catch (error: any) {
    res.status(500).send(errorJson(error.message));
  }
};

interface UserRecord {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
}

/**
 * Looks through Firebase and deletes every user created over 24 hours ago with an 
 * unverified email. Also deletes the user from the local database.
 */
export const deleteUnverifiedUsers = async () => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    
    const currentTime = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    for (const userRecord of listUsersResult.users) {
      const userData = userRecord.toJSON()! as UserRecord;

      const creationTime = new Date(userRecord.metadata.creationTime!).getTime();
      const timeDifference = currentTime - creationTime;

      if (!userData.emailVerified && timeDifference > twentyFourHours) {
        
        // await admin.auth().deleteUser(userData.uid);
        
        // await prisma.user.delete({
        //   where: {
        //     email: userData.email,
        //   },
        // });
        
        console.log(`Deleted unverified user: ${userData.uid}, ${userData.email}`);
      } else if (userData.emailVerified) {
        console.log(`User is verified: ${userData.uid}, ${userData.email}`)
      }
    }
    
    console.log('Deletion complete.');
  } catch (error) {
    console.error('Error deleting unverified users:', error);
  }
}
/**
 * Sends a message from the WebSocket server to all WebSocket-connected clients
 * @param resource is the API resource endpoint that has been updated. For example,
 * if a specific user with uuid "1234" was updated, the resource would be "/users/1234"
 */
export const socketNotify = (resource: string) => {
  const dataToSend = {
    resource: resource,
    message: "The resource has been updated!",
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(dataToSend));
    }
  });
};
