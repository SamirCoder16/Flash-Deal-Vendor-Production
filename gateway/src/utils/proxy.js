import { createProxyMiddleware } from "http-proxy-middleware";
import CircuitBreaker from "opossum";

export const proxy = (path, target) => {
  const breaker = new CircuitBreaker(
    () => Promise.resolve(), // No actual function, just a placeholder
    {
      timeout: 5000, // 5 seconds
      errorThresholdPercentage: 50,
      resetTimeout: 5000, // 5 seconds
    }
  );

  return async function (req, res, next) {
    breaker
      .fire()
      .then(() => {
        return createProxyMiddleware({
          target,
          changeOrigin: true,
          pathRewrite: { [`^${path}`]: "" },

          onError: (err, req, res) => {
            console.log("Proxy error:", err.message);
            res.status(502).json({ message: "Service down or unreachable" });
          },

          onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader("x-forwarded-by", "api-gateway");
          },

          timeout: 5000, // 5 seconds
        })(req, res, next);
      })
      .catch(() => {
        return res
          .status(503)
          .json({
            message: `Circuit Breaker: Service temporarily unavailable`,
          });
      });
  };
};
