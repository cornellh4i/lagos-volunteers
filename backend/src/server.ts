import express, { Application } from "express";
import bodyParser from "body-parser";
import userRouter from "./users/views";
import aboutRouter from "./about/views";
import eventRouter from "./events/views";
import swaggerUI from "swagger-ui-express";
import spec from "../api-spec.json";
import cors from "cors";
import cron from "node-cron";
import { deleteUnverifiedUsers } from "./utils/helpers";
import { WebSocketServer } from "ws";

export const app: Application = express();
export const wss = new WebSocketServer({ port: 8080 });

// Scheduled cron jobs

if (process.env.NODE_ENV !== `test`) {
  cron.schedule("0 0 * * *", () => {
    console.log("running a task every 24 hours");
    // deleteUnverifiedUsers();
  });
}

// Middleware to parse json request bodies
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

// Middleware to allow cross-origin requests
app.use(cors());

/**
 * Sub-routers for our main router, we should have one sub-router per "entity" in the application
 */
app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/about", aboutRouter);

// Root Url
app.get("/", (req, res) => {
  res.send("Hello World!").status(200);
});

// Default route for endpoints not defined
app.get("*", (req, res) => {
  res.send("You have reached a route not defined in this API");
});
