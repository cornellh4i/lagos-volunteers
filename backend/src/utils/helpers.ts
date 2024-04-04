import { Response } from "express";
import { errorJson, successJson } from "./jsonResponses";
import admin from "firebase-admin";
import { User } from "@prisma/client";
import deleteUser from "../users/controllers";
import prisma from "../../client";
import { WebSocket } from "ws";
import { wss } from "../server";
import sgMail from "@sendgrid/mail";
import { readFile } from "fs/promises";

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

      const creationTime = new Date(
        userRecord.metadata.creationTime!
      ).getTime();
      const timeDifference = currentTime - creationTime;

      if (!userData.emailVerified && timeDifference > twentyFourHours) {
        // await admin.auth().deleteUser(userData.uid);

        // await prisma.user.delete({
        //   where: {
        //     email: userData.email,
        //   },
        // });

        console.log(
          `Deleted unverified user: ${userData.uid}, ${userData.email}`
        );
      } else if (userData.emailVerified) {
        console.log(`User is verified: ${userData.uid}, ${userData.email}`);
      }
    }

    console.log("Deletion complete.");
  } catch (error) {
    console.error("Error deleting unverified users:", error);
  }
};
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

/**
 * Sends an email to the specified address
 * @param email is the email address to send to
 * @param subject is the email subject
 * @param path is the path of the email template
 */
export const sendEmail = async (
  email: string,
  subject: string,
  path: string
) => {
  try {
    // Loads an email template
    const html = await readFile(path, "utf-8");
    console.log("File content:", html);

    // Create an email message
    const msg = {
      to: email, // Recipient's email address
      from: "lagosfoodbankdev@gmail.com", // Sender's email address
      subject: subject, // Email subject
      html: html, // HTML body content
    };

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
