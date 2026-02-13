const { Router } = require("express");
const redirectRouter = Router();
const redirectController = require("../controller/redirectController");

redirectRouter.get("/:id", redirectController.retrieveUrl);

module.exports = redirectRouter;
