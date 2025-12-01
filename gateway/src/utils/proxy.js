import { createProxyMiddleware } from "http-proxy-middleware";
import CircuitBreaker from "opossum";
import { randomUUID } from "crypto";
import logger from "./logger.js";

// ---- CIRCUIT BREAKER OPTIONS ----
const breakerOptions = {
  timeout: 5000,                 // 5s timeout
  errorThresholdPercentage: 50,  // 50% failed then open circuit
  resetTimeout: 7000,            // after 7s try again
  rollingCountTimeout: 10000,    // window
  rollingCountBuckets: 10
};

export const proxy = (path, target) => {
  
  // Create a breaker for this route
  const breaker = new CircuitBreaker(
    () => Promise.resolve(), // just a "check"
    breakerOptions
  );

  // Event Logging
  breaker.on("open", () => logger.error(`🚨 Circuit OPEN for ${target}`));
  breaker.on("halfOpen", () => logger.warn(`🟡 Circuit HALF-OPEN for ${target}`));
  breaker.on("close", () => logger.info(`🟢 Circuit CLOSED for ${target}`));

  return async (req, res, next) => {
    const requestId = randomUUID();   // unique ID per request
      
    req.headers["x-request-id"] = requestId;
    req.headers["x-forwarded-by"] = "api-gateway";
    req.headers["x-service-target"] = target;

    breaker
      .fire()
      .then(() => {

        const middleware = createProxyMiddleware({
          target,
          changeOrigin: true,
          pathRewrite: { [`^${path}`]: "" },

          // --- RETRY SUPPORT ---
          proxyTimeout: 5000,
          timeout: 5000,

          onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader("x-request-id", requestId);
            proxyReq.setHeader("x-forwarded-for", req.ip);
          },

          onError(err, req, res) {
            console.error(`❌ Proxy Error → ${target}`);
            console.error("Request ID:", requestId);
            console.error(err.message);

            return res.status(502).json({
              success: false,
              requestId,
              message: "Upstream service unreachable",
            });
          }
        });

        return middleware(req, res, next);

      })
      .catch(() => {
        return res.status(503).json({
          success: false,
          requestId,
          message: "Circuit Breaker: Service temporarily unavailable",
        });
      });
  };
};
