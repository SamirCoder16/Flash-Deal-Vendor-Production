import rateLimit from 'express-rate-limit';

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 request per windows
    message: `Too many requests from this IP, Please try again after 15 minutes`,
    standardHeaders: true,
    legacyHeaders: false
});

export default authRateLimiter;