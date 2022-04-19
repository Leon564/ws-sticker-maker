const { randomBytes } = require("crypto");

const getFileType = async (data) => {
  const { fileTypeFromBuffer, fileTypeFromFile } = await import("file-type");

  const type = Buffer.isBuffer(data)
    ? await fileTypeFromBuffer(data)
    : await fileTypeFromFile(data).catch(() => {
        return null;
      });

  if (!type) {
    throw new Error("Invalid file type");
  }
  return type;
};

const generateStickerID = () => randomBytes(32).toString("hex");

const onlyEmojis = (array) => {
  var regex = /\p{Emoji}/u;
  return array.filter((x) => x.match(regex));
};

module.exports = {
  getFileType,
  generateStickerID,
  onlyEmojis,
};
