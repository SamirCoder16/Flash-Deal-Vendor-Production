import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

import { ENV } from "./lib/env.js";

const app = express();
const PORT = ENV.PORT;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Auth Service is running!");
});

app.get("/health", (req, res) => {
  res.send(`Service is Healthy`);
});

const startServer = () => {
  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Auth Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
