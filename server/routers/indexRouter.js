const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.json({
    name: "Broccolli URL Shortener",
    status: "running",
    version: "1.0.0",
  });
});

indexRouter.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = indexRouter;
