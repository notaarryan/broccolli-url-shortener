const { Router } = require("express");
const urlRouter = Router();
const urlController = require("../controller/urlController");

urlRouter.post("/", urlController.generateUrl);

module.exports = urlRouter;
