const { Router } = require("express");
const indexController = require("../controller/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.sendStatus);

indexRouter.get("/health", indexController.health);

module.exports = indexRouter;
