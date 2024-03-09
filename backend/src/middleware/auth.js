"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFirebaseUserToAdmin = exports.updateFirebaseUserToSupervisor = exports.setVolunteerCustomClaims = exports.authIfAdmin = exports.authIfSupervisor = exports.authIfVolunteer = exports.NoAuth = exports.auth = void 0;
const firebase = __importStar(require("firebase-admin"));
const { getAuth, Error } = require("firebase-admin/auth");
/** Retrieves a token from Firebase */
const getAuthToken = (req, res, next) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer") {
        req.authToken = req.headers.authorization.split(" ")[1];
    }
    else {
        req.authToken = " ";
    }
    next();
};
/** Authorizes a request if a token is present, returning an error otherwise. */
const auth = (req, res, next) => {
    getAuthToken(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { authToken } = req;
            const userInfo = yield firebase.auth().verifyIdToken(authToken);
            req.authId = userInfo.uid;
            return next();
        }
        catch (e) {
            return res.status(401).send({
                error: "You are not authorized to make this request",
            });
        }
    }));
};
exports.auth = auth;
const NoAuth = (req, res, next) => {
    next();
};
exports.NoAuth = NoAuth;
/**
 * Authorizes a request if a token is present with the volunteer claim,
 * returning an error otherwise.
 */
const authIfVolunteer = (req, res, next) => {
    getAuthToken(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userInfo = yield firebase.auth().verifyIdToken(req.authToken);
            if (userInfo.volunteer === true) {
                req.authId = userInfo.uid;
                return next();
            }
            return res.status(401).send({
                error: "You are not a volunteer to make this request",
            });
        }
        catch (e) {
            return res.status(401).send({
                error: "You are not authorized to make this request",
            });
        }
    }));
};
exports.authIfVolunteer = authIfVolunteer;
/**
 * Authorizes a request if a token is present with the supervisor claim,
 * returning an error otherwise.
 */
const authIfSupervisor = (req, res, next) => {
    getAuthToken(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userInfo = yield firebase.auth().verifyIdToken(req.authToken);
            if (userInfo.supervisor === true) {
                req.authId = userInfo.uid;
                return next();
            }
            return res.status(401).send({
                error: "You are not a supervisor to make this request",
            });
        }
        catch (e) {
            return res.status(401).send({
                error: "You are not authorized to make this request",
            });
        }
    }));
};
exports.authIfSupervisor = authIfSupervisor;
/**
 * Authorizes a request if a token is present with the admin claim,
 * returning an error otherwise.
 */
const authIfAdmin = (req, res, next) => {
    getAuthToken(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { authToken } = req;
            const userInfo = yield firebase.auth().verifyIdToken(authToken);
            if (userInfo.admin === true) {
                req.authId = userInfo.uid;
                return next();
            }
            return res.status(401).send({
                error: "You are not an admin to make this request",
            });
        }
        catch (e) {
            return res.status(401).send({
                error: "You are not authorized to make this request",
            });
        }
    }));
};
exports.authIfAdmin = authIfAdmin;
/**
 * Sets a user's custom claim to a volunteer
 * @param email is the user's email
 */
const setVolunteerCustomClaims = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = getAuth()
        .getUserByEmail(email)
        .then((userRecord) => {
        const customClaims = {
            admin: false,
            supervisor: false,
            volunteer: true,
        };
        getAuth().setCustomUserClaims(email, customClaims);
    })
        .catch((e) => {
        console.log("Error creating new user:", e);
    });
});
exports.setVolunteerCustomClaims = setVolunteerCustomClaims;
/**
 * Sets a user's custom claim to a supervisor
 * @param email is the user's email
 */
const updateFirebaseUserToSupervisor = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = getAuth()
        .getUserByEmail(email)
        .then((userRecord) => {
        const customClaims = {
            admin: false,
            supervisor: true,
            volunteer: true,
        };
        getAuth().setCustomUserClaims(userRecord.uid, customClaims);
    })
        .catch((e) => {
        console.log("Error creating new user:", e);
    });
});
exports.updateFirebaseUserToSupervisor = updateFirebaseUserToSupervisor;
/**
 * Sets a user's custom claim to an admin
 * @param email is the user's email
 */
const updateFirebaseUserToAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = getAuth()
        .getUserByEmail(email)
        .then((userRecord) => {
        const customClaims = {
            admin: true,
            supervisor: true,
            volunteer: true,
        };
        getAuth().setCustomUserClaims(userRecord.uid, customClaims);
    })
        .catch((e) => {
        console.log("Error creating new user:", e);
    });
});
exports.updateFirebaseUserToAdmin = updateFirebaseUserToAdmin;
exports.default = {
    auth: exports.auth,
    setVolunteerCustomClaims: exports.setVolunteerCustomClaims,
    updateFirebaseUserToSupervisor: exports.updateFirebaseUserToSupervisor,
    updateFirebaseUserToAdmin: exports.updateFirebaseUserToAdmin,
};
