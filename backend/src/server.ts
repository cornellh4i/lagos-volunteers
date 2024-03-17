import express, { Application } from "express";
import bodyParser from "body-parser";
import userRouter from "./users/views";
import eventRouter from "./events/views";
import swaggerUI from "swagger-ui-express";
import spec from "../api-spec.json";
import cors from "cors";
import prisma from "../client";

const app: Application = express();

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

app.get("/about", async (req, res) => {
  try {
    const aboutData = await prisma.about.findFirst();
    res.json(aboutData);
  } catch (e: any) {
    res.status(500).send({ success: false, error: e.message });
  }
});

app.patch("/:pageid/about", async (req, res) => {
  try {
    const { pageid } = req.params
    const { newContent } = req.body;
    const updatedAbout = await prisma.about.update({
      where: { id: pageid },
      data: {
        content: newContent,
      },
    });
    
    res.status(200).json({ message: 'Content updated successfully', updatedAbout });
  } catch (e: any) {
    console.error('Error updating content:', e);
    res.status(500).json({ message: 'Failed to update content' });
  }
});

// Root Url
app.get("/", (req, res) => {
  res.send("Hello World!").status(200);
});

// Default route for endpoints not defined
app.get("*", (req, res) => {
  res.send("You have reached a route not defined in this API");
});

export default app;
