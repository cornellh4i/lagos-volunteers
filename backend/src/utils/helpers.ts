import { Request, Response, NextFunction } from "express";
import { errorJson, successJson } from "./jsonResponses";
import admin from "firebase-admin";
import { User } from "@prisma/client";
import deleteUser from "../users/controllers";
import userController from "../users/controllers";
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
    // P2025 is Prisma error for NotFoundError
    if (error.code === "P2025") {
      res.status(404).send(errorJson(error.message));
    } else {
      res.status(500).send(errorJson(error.message));
    }
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
 * Takes in a userid and returns true if it matches the same user as the current
 * Firebase token OR if the Firebase token represents a supervisor or admin.
 * @param req - The request
 * @param userId - The user ID from your database
 * @returns A promise that resolves to true if both refer to the same user, otherwise false
 */
export const checkUserMatchOrSupervisorAdmin = async (
  req: Request,
  res: Response,
  userId: string,
  next: NextFunction
) => {
  // Get auth token
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const authToken = req.headers.authorization.split(" ")[1];
    const userInfo = await admin.auth().verifyIdToken(authToken);
    const firebaseId = userInfo.uid;
    const firebaseUser = await admin.auth().getUser(firebaseId);
    try {
      const user = await userController.getUserByID(userId);
      if (
        userInfo.supervisor === true ||
        userInfo.admin === true ||
        firebaseUser.email === user?.email
      ) {
        return next();
      }

      // Fall-through case
      return res.status(500).send({
        success: false,
        error:
          "You are not authorized since your Firebase id does not match the specified userid.",
      });
    } catch (error: any) {
      // P2025 is Prisma error for NotFoundError
      if (error.code === "P2025") {
        res.status(404).send(errorJson(error.message));
      } else {
        res.status(500).send(errorJson(error.message));
      }
    }
  }
};

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
  html: string
) => {
  try {
    // // Loads an email template
    // const html = await readFile(path, "utf-8");
    // console.log("File content:", html);

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

/**
 * Uses a regex to find all variables to be replaced by searching for the brackets []
 * @param originalString is the html string of the event update email template
 * @param placeholder is the key word that needs to be replaced
 * @param replacement is what should replace the key word
 * @returns the event update email template string with necessary replacements
 */
export const replaceInText = (
  originalString: string,
  placeholder: string,
  replacement: string
) => {
  const regex = new RegExp("\\[" + placeholder + "\\]", "g");
  return originalString.replace(regex, replacement);
};

/**
 * Replaces the key words in event update email template with necessary information about inputted event and user
 * @param originalHtml is the html string of the event update email template
 * @param eventName is the name of event
 * @param userName is the name of user
 * @param eventDateTimeString is the date and time of event
 * @param eventLocation is the location of event
 * @param textBody is the phrase that changes based on function
 * @returns new html string with changed values
 */
export const replaceEventInputs = (
  originalHtml: string,
  eventName: string,
  userName: string,
  eventDateTimeString: string,
  eventLocation: string,
  textBody: string
) => {
  // checks emailHTML string, finds instances of EVENT NAME and replaces it with ${event.name}
  // change path instead to the html file with the replaced "variables" given eventid or userid
  let tmp1 = replaceInText(originalHtml, "EVENT NAME", eventName);
  let tmp2 = replaceInText(tmp1, "USER NAME", userName);
  let tmp3 = replaceInText(tmp2, "EVENT DATETIME", eventDateTimeString);
  let tmp4 = replaceInText(tmp3, "EVENT LOCATION", eventLocation);
  let tmp5 = replaceInText(tmp4, "TEXT BODY", textBody);
  return tmp5;
};

/**
 * Replaces the key words in user update email template with necessary information about inputted event and user
 * @param originalHtml is the html string of the event update email template
 * @param userName is the name of user
 * @param textBody is the phrase that changes based on function
 * @returns new html string with changed values
 */
export const replaceUserInputs = (
  originalHtml: string,
  userName: string,
  textBody: string
) => {
  let tmp1 = replaceInText(originalHtml, "USER NAME", userName);
  let tmp2 = replaceInText(tmp1, "TEXT BODY", textBody);
  return tmp2;
};
