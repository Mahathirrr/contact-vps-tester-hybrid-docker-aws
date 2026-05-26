// Initialize OpenTelemetry tracing BEFORE importing other modules
import "./application/tracing.js";

import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

const PORT = process.env.PORT || 3000;

web.listen(PORT, () => {
    logger.info(`App start on port ${PORT}`);
});
