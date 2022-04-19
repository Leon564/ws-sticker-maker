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



module.exports = {
  getFileType,
};
