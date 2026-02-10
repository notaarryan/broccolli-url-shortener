const crypto = require("crypto");

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function hashUrl(input) {
  return crypto.createHash("sha256").update(input).digest();
}

function base62Encode(buffer, length = 7) {
  let num = BigInt("0x" + buffer.toString("hex"));
  let result = "";

  while (num > 0n && result.length < length) {
    result = BASE62[num % 62n] + result;
    num = num / 62n;
  }

  return result.padStart(length, "0");
}

function generateShortId(originalUrl, userId) {
  const hash = hashUrl(originalUrl + userId);
  return base62Encode(hash, 7);
}

module.exports = generateShortId;
