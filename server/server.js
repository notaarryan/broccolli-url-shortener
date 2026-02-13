const express = require("express");
const app = express();
const indexRouter = require("./routers/indexRouter");
const urlRouter = require("./routers/urlRouter");
const redirectRouter = require("./routers/redirectRouter");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/url", urlRouter);
app.use("/", redirectRouter);

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("hahaha");
  }
});
