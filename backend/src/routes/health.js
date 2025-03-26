const { Router } = require("express");
const { basicHealthStatus } = require("../controllers/health");

const healthRouter = Router();
healthRouter.get("/", basicHealthStatus);

module.exports = healthRouter;
