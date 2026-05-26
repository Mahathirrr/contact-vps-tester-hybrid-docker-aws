import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("contact-backend", "1.0.0");

/**
 * Wrap an async function with an OpenTelemetry span.
 * Usage:
 *   const result = await withSpan("db.findUser", async () => {
 *     return prisma.user.findUnique({...})
 *   })
 */
export async function withSpan(name, fn, attributes = {}) {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await fn();
      span.setStatus({ code: 1 }); // OK
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message }); // ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}

export { tracer };
