import { Router } from "express";
import { basicHealthStatus } from "../controllers/health.js";

const healthRouter = Router();
healthRouter.get("/", basicHealthStatus);

export default healthRouter;
