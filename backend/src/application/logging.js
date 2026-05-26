import winston from "winston";
const { format } = winston;
import pkgApi from "@opentelemetry/api";

const { trace, context } = pkgApi;

// Custom format to inject trace_id and span_id into log entries
const traceFormat = format((info) => {
  const spanContext = trace.getSpanContext(context.active());
  if (spanContext) {
    info.trace_id = spanContext.traceId;
    info.span_id = spanContext.spanId;
    info.trace_flags = spanContext.traceFlags;
  }
  info.service = "contact-backend";
  info.environment = process.env.NODE_ENV || "development";
  return info;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    traceFormat(),
    format.json()
  ),
  defaultMeta: {
    service: "contact-backend",
    version: "1.0.0",
  },
  transports: [
    new winston.transports.Console({}),
  ],
});
