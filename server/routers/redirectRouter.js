const { Router } = require("express");
const redirectRouter = Router();

redirectRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  console.log(id);

  if (["url", "auth", "health"].includes(id)) {
    return res.sendStatus(404);
  }

  res.send("OK"); //get originalUrl and then redirect
});

module.exports = redirectRouter;
