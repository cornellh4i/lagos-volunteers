import express from "express";
import bodyParser from "body-parser";
import userRouter from "./users/views";
import postRouter from "./posts/views";
import swaggerUI from "swagger-ui-express";
import spec from "../api-spec.json";

const app = express();

// Middleware to parse json request bodies
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

/**
 * Sub-routers for our main router, we should have one sub-router per "entity" in the application
 */
app.use("/user", userRouter);
app.use("/post", postRouter);

// Root Url
app.get("/", (req, res) => {
  res.send("Hello World!").status(200);
});

// Default route for endpoints not defined
app.get("*", (req, res) => {
  res.send("You have reached a rounte not defined in this API");
});

app.post("/", (req, res) => {
  res.send(req.body);
});

app.listen(process.env.PORT || 8000, async () => {
  console.log("✅ Server is up and running at http://localhost:8000");
});

export default app;
