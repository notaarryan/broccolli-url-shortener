const indexController = {
  sendStatus: (req, res) => {
    res.json({
      name: "Broccolli URL Shortener",
      status: "running",
      version: "1.0.0",
    });
  },
  health: (req, res) => {
    res.status(200).send("OK");
  },
};

module.exports = indexController;
