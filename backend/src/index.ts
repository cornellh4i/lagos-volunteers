import { app, wss } from "./server";
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

// WebSocket server
wss.on("connection", (ws) => {
  // Error handling
  ws.on("error", console.error);

  // What happens when the server receives data
  ws.on("message", (data) => {
    console.log("received: %s", data);
    ws.send("server received your message!");
  });

  // Default message to send when connected
  ws.send("something");
});

// Express server
export const server = app.listen(process.env.PORT || 8000);

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

server.on("listening", () => {
  console.log("✅ Server is up and running at http://localhost:8000");
});

server.on("error", (error) => {
  console.log("❌ Server failed to start due to error: %s", error);
});
