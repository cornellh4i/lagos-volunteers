import * as firebase from "firebase-admin";
import { NextFunction, Request, Response } from "express";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { userRole } from "@prisma/client";
const { getAuth, Error } = require("firebase-admin/auth");
import admin from "firebase-admin";

export interface IGetAuthTokenRequest extends Request {
  authToken: string;
  authId: string;
}

/** Retrieves a token from Firebase */
const getAuthToken = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = " ";
  }
  next();
};

/** Authorizes a request if a token is present, returning an error otherwise. */
export const auth = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await firebase.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      return res.status(401).send({
        error: "You are not authorized to make this request",
      });
    }
  });
};

export const NoAuth = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  next();
};

/**
 * Authorizes a request if a token is present with the volunteer claim,
 * returning an error otherwise.
 */
export const authIfVolunteer = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    try {
      const userInfo = await firebase.auth().verifyIdToken(req.authToken);
      if (userInfo.volunteer === true) {
        req.authId = userInfo.uid;
        return next();
      }
      return res.status(401).send({
        error: "You are not a volunteer to make this request",
      });
    } catch (e) {
      return res.status(401).send({
        error: "You are not authorized to make this request",
      });
    }
  });
};

/**
 * Authorizes a request if a token is present with the supervisor claim,
 * returning an error otherwise.
 */
export const authIfSupervisor = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    try {
      const userInfo = await firebase.auth().verifyIdToken(req.authToken);
      if (userInfo.supervisor === true) {
        req.authId = userInfo.uid;
        return next();
      }
      return res.status(401).send({
        error: "You are not a supervisor to make this request",
      });
    } catch (e) {
      return res.status(401).send({
        error: "You are not authorized to make this request",
      });
    }
  });
};

/**
 * Authorizes a request if a token is present with the admin claim,
 * returning an error otherwise.
 */
export const authIfAdmin = (
  req: IGetAuthTokenRequest,
  res: Response,
  next: NextFunction
) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await firebase.auth().verifyIdToken(authToken);
      if (userInfo.admin === true) {
        req.authId = userInfo.uid;
        return next();
      }
      return res.status(401).send({
        error: "You are not an admin to make this request",
      });
    } catch (e) {
      return res.status(401).send({
        error: "You are not authorized to make this request",
      });
    }
  });
};

/**
 * Sets a user's custom claim to a volunteer
 * @param email is the user's email
 */
export const setVolunteerCustomClaims = async (email: string) => {
  try {
    const user = await getAuth().getUserByEmail(email);
    const customClaims = {
      admin: false,
      supervisor: false,
      volunteer: true,
    };
    await getAuth().setCustomUserClaims(user.uid, customClaims);
  } catch (e) {
    console.log("Error creating new user:", e);
  }
};

/**
 * Sets a user's custom claim to a supervisor
 * @param email is the user's email
 */
export const updateFirebaseUserToSupervisor = async (email: string) => {
  // const user = getAuth()
  try {
    const user = await getAuth().getUserByEmail(email);
    const customClaims = {
      admin: false,
      supervisor: true,
      volunteer: true,
    };
    await getAuth().setCustomUserClaims(user.uid, customClaims);
    const updatedUserRecord = await getAuth().getUserByEmail(email);
    console.log(updatedUserRecord);
  } catch (e) {
    console.log("Error creating new user:", e);
  }
  //   .getUserByEmail(email)
  //   .then((userRecord: UserRecord) => {
  //     const customClaims = {
  //       admin: false,
  //       supervisor: true,
  //       volunteer: true,
  //     };
  //     getAuth().setCustomUserClaims(userRecord.uid, customClaims);
  //     const updatedUserRecord = getAuth().getUserByEmail(email);
  //     console.log(updatedUserRecord);

  //   })
  //   .catch((e: Error) => {
  //     console.log("Error creating new user:", e);
  //   });
};

/**
 * Sets a user's custom claim to an admin
 * @param email is the user's email
 */
export const updateFirebaseUserToAdmin = async (email: string) => {
  try {
    const user = await getAuth().getUserByEmail(email);
    const customClaims = {
      admin: true,
      supervisor: true,
      volunteer: true,
    };
    await getAuth().setCustomUserClaims(user.uid, customClaims);
  } catch (e) {
    console.log("Error creating new user:", e);
  }
};

export default {
  auth,
  setVolunteerCustomClaims,
  updateFirebaseUserToSupervisor,
  updateFirebaseUserToAdmin,
};
