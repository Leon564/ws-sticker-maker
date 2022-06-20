const { Image } = require("node-webpmux");
const validator = require("validator");
const Exif = require("./metadata/exif");
const towebp = require("../tools/imageToWebp");
const utils = require("./utils");
const downloadToBuffer = require("../tools/downloadToBuffer");

module.exports = class converter {
  constructor(options = {}) {
    this.options = options;
  }

  convert = async () => {
    if (!this.options) throw new Error("No options provided");
    if (!Buffer.isBuffer(this.options.image)) {
      this.options.image = validator.isURL(this.options.image)
        ? (this.options.image = await downloadToBuffer(this.options.image))
        : this.options.image;
    }

    const { ext, mime } = await utils.getFileType(this.options.image);
   
    this.options.isAnimated = ["video", "webp", "gif", "webm", "mp4"].includes(
      ext
    );
    this.options.FileMime = mime;
    const bufferWebp = await towebp(this.options);

    const img = new Image();

    await img.load(bufferWebp);

    this.options.categories = utils.onlyEmojis(this.options.categories);
    const exif = new Exif(this.options);
    img.exif = exif.build();
   
    return await img.save(null);
  };
};
