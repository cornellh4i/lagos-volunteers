import app from "./server";

const server = app.listen(process.env.PORT || 8000);

server.on("listening", () => {
  console.log("✅ Server is up and running at http://localhost:8000");
});

server.on("error", (error) => {
  console.log("❌ Server failed to start due to error: %s", error);
});
