import { proxy } from "./utils/proxy.js";
import { ENV } from "./lib/env.js";
import { authMiddleware } from "./middlewares/auth_middleware.js";

export const routes = (app) => {
  const BASE = "/api/v1";

  // All Services URLs
  const ANALYTICS_SERVICE_URL = ENV.ANALYTICS_SERVICE_URL;
  const AUTH_SERVICE_URL = ENV.AUTH_SERVICE_URL;
  const DEALS_SERVICE_URL = ENV.DEALS_SERVICE_URL;
  const NOTIFICATIONS_SERVICE_URL = ENV.NOTIFICATIONS_SERVICE_URL;
  const VENDORS_SERVICE_URL = ENV.VENDORS_SERVICE_URL;

  // Public routes
  app.use(`${BASE}/auth`, proxy(`${BASE}/auth`, AUTH_SERVICE_URL));

  // Protected routes
  app.use(`${BASE}/analytics`,authMiddleware,proxy(`${BASE}/analytics`, ANALYTICS_SERVICE_URL));
  app.use(`${BASE}/deals`, authMiddleware, proxy(`${BASE}/deals`, DEALS_SERVICE_URL));
  app.use(`${BASE}/notifications`,authMiddleware,proxy(`${BASE}/notifications`, NOTIFICATIONS_SERVICE_URL));
  app.use(`${BASE}/vendors`, authMiddleware, proxy(`${BASE}/vendors`, VENDORS_SERVICE_URL));
};
