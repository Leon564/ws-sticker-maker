const utils = require("../utils");
class RawMetadata {
  constructor(options) {
    this["sticker-pack-id"] = options.id || utils.generateStickerID();
    this["sticker-pack-name"] = options.pack || "";
    this["sticker-pack-publisher"] = options.author || "";
    this.emojis = options.categories || [];
  }
}

module.exports = RawMetadata;
