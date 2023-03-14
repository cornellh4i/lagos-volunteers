import * as firebase from 'firebase-admin';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { userRole } from '@prisma/client';
const { getAuth } = require("firebase-admin/auth");

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
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') 
  {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = ' ';
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
        error: 'You are not authorized to make this request' 
      });
    }
  });
};

/** Authorizes a request if a token is present with the volunteer claim, 
 *  returning an error otherwise. */
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
        error: 'You are not a volunteer to make this request' 
      });
    } catch (e) {
      return res.status(401).send({ 
        error: 'You are not authorized to make this request' 
      });
    }
  })
}

/** Authorizes a request if a token is present with the supervisor claim, 
 *  returning an error otherwise. */
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
        error: 'You are not a supervisor to make this request' 
      });
    } catch (e) {
      return res.status(401).send({ 
        error: 'You are not authorized to make this request' 
      });
    }
  })
}


/** Authorizes a request if a token is present with the admin claim, 
 *  returning an error otherwise. */
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
        error: 'You are not an admin to make this request' 
      });
    } catch (e) {
      return res.status(401).send({ 
        error: 'You are not authorized to make this request' 
      });
    }
  })
}

/** Create a firebase user and define the custom claims based on the role. */
export const createFirebaseUser = (
  email:string,
  password: string,
  role: userRole
)=>{
  getAuth()
  .createUser({
    email: email,
    password: password
  })
  .then((userRecord: UserRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
    const customClaims = {
      admin: false,
      supervisor: false,
      volunteer:true
    };
    if(role==userRole.ADMIN){
      customClaims['admin']==true
      customClaims['supervisor']==true
    }
    if(role==userRole.SUPERVISOR){
      customClaims['supervisor']==true
    }
    getAuth().setCustomUserClaims(userRecord.uid, customClaims);
  })
  .catch((e:Error) => {
    console.log('Error creating new user:', e);
  });
}

export default{
  auth,
  createFirebaseUser
}