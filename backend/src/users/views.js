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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = __importDefault(require("./controllers"));
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
const firebase = __importStar(require("firebase-admin"));
const helpers_1 = require("../utils/helpers");
let useAuth;
process.env.NODE_ENV === "test"
    ? (useAuth = auth_1.NoAuth)
    : (useAuth = auth_1.auth);
userRouter.post("/", auth_1.NoAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    let user;
    const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
    try {
        // Create user in local database
        user = yield controllers_1.default.createUser(rest, rest.profile, rest.preferences, rest.permissions);
        // If local user doesn't exist, throw error
        if (!user) {
            throw Error("Failed to create local user");
        }
        // If test environment, return user without firebase auth
        else if (process.env.NODE_ENV === "test") {
            return res.status(201).send({ success: true, data: user });
        }
        // Otherwise, create user in Firebase
        else {
            const fbUser = yield firebase.auth().createUser({
                uid: user.id,
                email: rest.email,
                password: password,
            });
            if (fbUser) {
                yield firebase.auth().setCustomUserClaims(fbUser.uid, {
                    volunteer: true,
                });
                return res.status(200).send({ success: true, user: user });
            }
        }
    }
    catch (e) {
        // If user exists in local database but not in Firebase, delete user
        if (user) {
            try {
                yield controllers_1.default.deleteUser(user.id);
            }
            catch (e) {
                return res.status(500).send({ success: false, error: e.message });
            }
        }
        return res.status(500).send({ success: false, error: e.message });
    }
}));
userRouter.delete("/:userid", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.deleteUser(req.params.userid));
}));
userRouter.put("/:userid", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.updateUser(req.params.userid, req.body));
}));
userRouter.get("/count", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, controllers_1.default.getCountUsers);
}));
userRouter.get("/", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    const filter = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        nickname: req.query.nickname,
        email: req.query.email,
        role: req.query.role,
        hours: req.query.hours ? parseInt(req.query.hours) : undefined,
        status: req.query.status,
        eventId: req.query.eventId,
    };
    const sortQuery = req.query.sort;
    const querySplit = sortQuery ? sortQuery.split(":") : ["default", "asc"];
    const key = querySplit[0];
    const order = querySplit[1];
    const sort = {
        key: key,
        order: order,
    };
    const pagination = {
        after: req.query.after,
        limit: req.query.limit,
    };
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUsers(filter, sort, pagination));
}));
userRouter.get("/pagination", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUsersPaginated(req));
}));
userRouter.get("/search", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    const { email, firstName, lastName, role, status, hours, nickname } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getSearchedUser(req, email, firstName, lastName, role, status, hours, nickname));
}));
userRouter.get("/sorting", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUsersSorted(req));
}));
userRouter.get("/:userid/profile", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUserProfile(req.params.userid));
}));
userRouter.get("/:userid/role", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUserRole(req.params.userid));
}));
userRouter.get("/:userid/preferences", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUserPreferences(req.params.userid));
}));
userRouter.get("/:userid", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getUserByID(req.params.userid));
}));
userRouter.get("/:userid/created", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getCreatedEvents(req.params.userid));
}));
userRouter.get("/:userid/registered", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getRegisteredEvents(req.params.userid, req.query.eventid));
}));
userRouter.get("/:userid/hours", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.getHours(req.params.userid));
}));
userRouter.put("/:userid/profile", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.editProfile(req.params.userid, req.body));
}));
userRouter.put("/:userid/preferences", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.editPreferences(req.params.userid, req.body));
}));
userRouter.patch("/:userid/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    const { status } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.editStatus(req.params.userid, status));
}));
userRouter.patch("/:userid/role", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    const { role } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.editRole(req.params.userid, role));
}));
userRouter.patch("/:userid/hours", useAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Users']
    const { hours } = req.body;
    (0, helpers_1.attempt)(res, 200, () => controllers_1.default.editHours(req.params.userid, hours));
}));
exports.default = userRouter;
