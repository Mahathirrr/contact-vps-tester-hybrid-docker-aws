import express from "express";
import userController from "../controller/user-controller.js";
import healthController from "../controller/health-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);

// Health check endpoints
publicRouter.get('/ping', healthController.ping);
publicRouter.get('/health', healthController.health);
publicRouter.get('/health/readiness', healthController.readiness);

export {
    publicRouter
}
