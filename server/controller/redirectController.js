const db = require("../model/queries");

const redirectController = {
  retrieveUrl: async (req, res) => {
    try {
      const { id } = req.params;

      if (["url", "auth", "health"].includes(id)) {
        return res.sendStatus(404);
      }

      const result = await db.findUrl(id);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      const { original_url, click_count } = result.rows[0];

      await db.incrementCount(click_count, id);

      return res.redirect(original_url);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = redirectController;
