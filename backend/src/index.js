"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const server = server_1.default.listen(process.env.PORT || 8000);
const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
server.on("listening", () => {
    console.log("✅ Server is up and running at http://localhost:8000");
});
server.on("error", (error) => {
    console.log("❌ Server failed to start due to error: %s", error);
});
