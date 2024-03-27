import express, { Application } from "express";
import bodyParser from "body-parser";
import userRouter from "./users/views";
import eventRouter from "./events/views";
import swaggerUI from "swagger-ui-express";
import spec from "../api-spec.json";
import cors from "cors";
import cron from "node-cron";

const app: Application = express();

// Scheduled cron jobs
cron.schedule("*/1 * * * *", () => {
  console.log("running a task every minute");
});

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

// Root Url
app.get("/", (req, res) => {
  res.send("Hello World!").status(200);
});

// Default route for endpoints not defined
app.get("*", (req, res) => {
  res.send("You have reached a route not defined in this API");
});

export default app;
