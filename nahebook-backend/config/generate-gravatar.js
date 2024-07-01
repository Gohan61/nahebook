const crypto = require("crypto");

function getGravatarUrl(username, size = 80) {
  const trimmedUsername = username.trim();
  const hash = crypto
    .createHash("sha256")
    .update(trimmedUsername)
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

module.exports = getGravatarUrl;
