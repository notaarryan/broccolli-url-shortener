const pool = require("./pool");

const queries = {
  checkUser: async (originalUrl, userId) => {
    return await pool.query(
      "SELECT short_code FROM urls WHERE original_url = $1 AND user_id = $2",
      [originalUrl, userId],
    );
  },
  insertNewUrl: async (originalUrl, shortId, userId) => {
    await pool.query(
      "INSERT INTO urls (original_url, short_code, user_id) VALUES ($1, $2, $3)",
      [originalUrl, shortId, userId],
    );
  },
  findUrl: async (id) => {
    return await pool.query(
      "SELECT original_url, click_count FROM urls WHERE short_code = $1",
      [id],
    );
  },
  incrementCount: async (click_count, id) => {
    await pool.query(
      "UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1",
      [id],
    );
  },
};

module.exports = queries;
