"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const views_1 = __importDefault(require("./users/views"));
const views_2 = __importDefault(require("./events/views"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api_spec_json_1 = __importDefault(require("../api-spec.json"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware to parse json request bodies
app.use(body_parser_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_spec_json_1.default));
// Middleware to allow cross-origin requests
app.use((0, cors_1.default)());
/**
 * Sub-routers for our main router, we should have one sub-router per "entity" in the application
 */
app.use("/users", views_1.default);
app.use("/events", views_2.default);
// Root Url
app.get("/", (req, res) => {
    res.send("Hello World!").status(200);
});
// Default route for endpoints not defined
app.get("*", (req, res) => {
    res.send("You have reached a route not defined in this API");
});
exports.default = app;
