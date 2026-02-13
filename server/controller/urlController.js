const db = require("../model/queries");
const generateShortId = require("../deterministicIdGenerator");

const urlController = {
  generateUrl: async (req, res) => {
    try {
      const originalUrl = req.body.originalUrl;

      if (!originalUrl) {
        return res.status(400).json({ error: "Original URL is required" });
      }

      const userId = req.user && req.user.id ? req.user.id : 0;

      const shortId = generateShortId(originalUrl, userId);

      const existing = await db.checkUser(originalUrl, userId);

      if (existing.rows.length > 0) {
        return res.json({
          shortenedUrl: `${process.env.BASE_URL}/${existing.rows[0].short_code}`,
        });
      }

      await db.insertNewUrl(originalUrl, shortId, userId);

      res.json({
        shortenedUrl: `${process.env.BASE_URL}/${shortId}`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = urlController;
