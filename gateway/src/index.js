import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./lib/env.js";
import logger from "./utils/logger.js";
import { rateLimiter } from "./middlewares/ratelimit.js";
import { routes } from "./routes.js";

const app = express();
const GATEWAY_PORT = ENV.GATEWAY_PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.json({ message: "Flash Deal Gateway is running" });
});

app.get('/health', (req,res) => {
  res.status(200).json({ message: "gateway service is Healthy" });
});

// All routes map here 
routes(app);

// error Handler
app.use((err,req,res,next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Gateway Error" });
})

const startServer = async () => {
  app.listen(GATEWAY_PORT, () => {
    logger.info(`Gateway is running on port ${GATEWAY_PORT}`);
  });
};
startServer();
