import express, { Application } from "express";
import bodyParser from "body-parser";
import userRouter from "./users/views";
import eventRouter from "./events/views";
import swaggerUI from "swagger-ui-express";
import spec from "../api-spec.json";
import admin from "firebase-admin"

const app: Application = express();

// Middleware to parse json request bodies
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

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
  res.send("You have reached a rounte not defined in this API");
});

app.post("/", (req, res) => {
  res.send(req.body);
});

if(!process.env.PRIVATE_KEY){
  throw new Error("private key is empty");
}

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});


export default app;
