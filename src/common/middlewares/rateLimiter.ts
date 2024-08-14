import { rateLimit } from "express-rate-limit";

const rateLimiterMiddleware = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 10, // limit each IP to 10 requests per 1 minute
	message: "Too many requests from this IP, please try again after 1 minute",
});

export default rateLimiterMiddleware;
