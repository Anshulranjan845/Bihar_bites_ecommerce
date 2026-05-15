import "dotenv/config";

import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Server shutting down");

  server.close(() => {
    process.exit(0);
  });
});
