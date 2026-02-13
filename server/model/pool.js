const { Pool } = require("pg");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

module.exports = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USERNAME,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});
