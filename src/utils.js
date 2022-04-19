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

module.exports = {
  getFileType,
  generateStickerID,
};
