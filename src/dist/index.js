const Converter = require("./coverter");
const { writeFile } = require("fs-extra");

class sticker {
  constructor(image) {
    this.image = image || null;
  }
  setImage(image) {
    this.image = image;
    return this;
  }
  setAuthor(author) {
    this.author = author;
    return this;
  }
  setPack(pack) {
    this.pack = pack;
    return this;
  }
  setBackground(background) {
    this.background = background;
    return this;
  }
  setFps(fps) {
    this.fps = fps;
    return this;
  }
  setQuality(quality) {
    this.quality = quality;
    return this;
  }
  setId(id) {
    this.id = id;
    return this;
  }
  setType(type) {
    this.type = type;
    return this;
  }
  setCategories(categories) {
    this.categories = Array.isArray(categories) ? categories : [];
    return this;
  }

  build = async () => {
    if (!this.image) throw new Error("image is required");
    let options = {
      image: this.image,
      author: this.author || "",
      pack: this.pack || "",
      quality: this.quality || 50,
      id: this.id,
      type: this.type || "default",
      background: this.background || { r: 0, g: 0, b: 0, alpha: 0 },
      fps: this.fps || 10,
      categories: this.categories || [],
    };
    this.result = await new Converter(options).convert();
    return this;
  };

  toBuffer = async () => {
    if (!this.result) await this.build();
    return this.result;
  };

  defaultFilename() {
    return `./${this.pack || "sticker"}-${this.author || "WSM"}.webp`;
  }

  toFile = async (path) => {
    if (!this.result) await this.build();
    if (!path) path = this.defaultFilename();
    return writeFile(path, this.result);
  };

  toMessage = async () => {
    if (!this.result) await this.build();
    return { sticker: this.result };
  };
}
module.exports = sticker;
