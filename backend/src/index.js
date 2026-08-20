import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/index.js";
import logger from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error(error, "MongoDB connection error");
    process.exit(1);
  });
