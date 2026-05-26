import { prismaClient } from "../application/database.js";

const ping = async (req, res, next) => {
    try {
        res.send('PONG');
    } catch (e) {
        next(e);
    }
}

const health = async (req, res, next) => {
    try {
        const healthCheck = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
            services: {
                database: 'OK',
                api: 'OK'
            }
        };

        // Test database connection
        try {
            await prismaClient.$queryRaw`SELECT 1`;
            healthCheck.services.database = 'OK';
        } catch (dbError) {
            healthCheck.services.database = 'ERROR';
            healthCheck.status = 'DEGRADED';
        }

        // Set HTTP status based on health
        const httpStatus = healthCheck.status === 'OK' ? 200 : 503;
        
        res.status(httpStatus).json(healthCheck);
    } catch (e) {
        next(e);
    }
}

const readiness = async (req, res, next) => {
    try {
        // Check if app is ready to serve requests
        const ready = {
            status: 'READY',
            timestamp: new Date().toISOString(),
            checks: {
                database: false,
                prisma: false
            }
        };

        // Test database connection
        try {
            await prismaClient.$queryRaw`SELECT 1`;
            ready.checks.database = true;
        } catch (error) {
            ready.checks.database = false;
        }

        // Test Prisma client
        try {
            await prismaClient.user.findFirst();
            ready.checks.prisma = true;
        } catch (error) {
            ready.checks.prisma = false;
        }

        // Determine overall readiness
        const isReady = Object.values(ready.checks).every(check => check === true);
        ready.status = isReady ? 'READY' : 'NOT_READY';

        const httpStatus = isReady ? 200 : 503;
        res.status(httpStatus).json(ready);
    } catch (e) {
        next(e);
    }
}

export default {
    ping,
    health,
    readiness
}
