import { Response } from "express";
import { errorJson, successJson } from "./jsonResponses";
import admin from "firebase-admin";
import { User } from "@prisma/client";
import deleteUser from "../users/controllers";
import prisma from "../../client";

// const serviceAccount = {
//   type: process.env.TYPE,
//   project_id: process.env.PROJECT_ID,
//   private_key_id: process.env.PRIVATE_KEY_ID,
//   private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
//   client_email: process.env.CLIENT_EMAIL,
//   client_id: process.env.CLIENT_ID,
//   auth_uri: process.env.AUTH_URI,
//   token_uri: process.env.TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
//   client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

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
        
        console.log(`Deleted unverified user: ${userData.uid}`);
      }
    }
    
    console.log('Deletion complete.');
  } catch (error) {
    console.error('Error deleting unverified users:', error);
  }
}
