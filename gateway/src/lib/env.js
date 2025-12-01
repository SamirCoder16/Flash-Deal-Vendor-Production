
export const ENV = {
    GATEWAY_PORT: process.env.GATEWAY_PORT || 8080,
    ANALYTICS_SERVICE_URL: process.env.ANALYTICS_SERVICE_URL || "http://localhost:5001",
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:5002",
    DEALS_SERVICE_URL: process.env.DEALS_SERVICE_URL || "http://localhost:5003",
    NOTIFICATIONS_SERVICE_URL: process.env.NOTIFICATIONS_SERVICE_URL || "http://localhost:5004",
    VENDORS_SERVICE_URL: process.env.VENDORS_SERVICE_URL || "http://localhost:5005",
}