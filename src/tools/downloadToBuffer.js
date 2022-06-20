const axios = require("axios");

const downloadToBuffer = async (url) => {
  const img = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(img.data, "utf-8");
};

module.exports = downloadToBuffer;
