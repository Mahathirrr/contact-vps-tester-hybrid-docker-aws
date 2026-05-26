import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import cors from "cors";
import { logger } from "./logging.js";
import client from "prom-client";

export const web = express();
web.use(express.json());

// CORS configuration from environment variable
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true
};
web.use(cors(corsOptions));

// Prometheus metrics
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequestTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});

client.collectDefaultMetrics({ register: client.register });

// Request logging middleware with trace context + metrics
web.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const route = req.route ? req.route.path : req.path;
        const statusCode = res.statusCode.toString();

        httpRequestTotal.inc({ method: req.method, route, status_code: statusCode });
        httpRequestDuration.observe(
            { method: req.method, route, status_code: statusCode },
            duration / 1000
        );

        logger.info({
            message: "HTTP request",
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration_ms: duration,
            userAgent: req.get("user-agent"),
            ip: req.ip,
        });
    });
    next();
});

// Prometheus metrics endpoint
web.get("/metrics", async (req, res) => {
    try {
        res.set("Content-Type", client.register.contentType);
        res.end(await client.register.metrics());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);
