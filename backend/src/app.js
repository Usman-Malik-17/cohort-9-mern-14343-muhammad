import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import { ApiError } from "./utils/api-error.js";

const app = express();

app.use(pinoHttp({ logger }));

// basic configurations
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

// cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// import the routes

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";

app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Welcome to basecampy");
});
app.get("/instagram", (req, res) => {
  res.send("Welcome to basecampy");
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    logger.error({ err }, err.message);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // agar koi aur unexpected error ho (ApiError nahi)
  logger.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
