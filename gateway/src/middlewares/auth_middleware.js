import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { ENV } from "../lib/env.js";

const JWT_SECRET = ENV.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      logger.warn(`No token | IP: ${req.ip}`);
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn(`Token not found | IP: ${req.ip}`);
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user data for downstream microservices
    req.user = decoded;

    next();
  } catch (error) {
    logger.error(`JWT Error: ${error.message} | IP: ${req.ip}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
