const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

const port = 8080 || process.env.PORT;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("hahaha");
  }
});
