const { Router } = require("express");
const urlRouter = Router();
const generateShortId = require("../deterministicIdGenerator");

urlRouter.post("/", (req, res) => {
  const originalUrl = req.body.originalUrl;
  const encodedUrl =
    "https://example.com/" + generateShortId(originalUrl, "00000");
  //save to backend
  res.json({
    shortenedUrl: encodedUrl,
  });
});

module.exports = urlRouter;
