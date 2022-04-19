const RawMetadata = require("./rawMetadata");

class Exif {
  constructor(options) {
    this.data = new RawMetadata(options);
  }

  build = () => {
    const data = JSON.stringify(this.data);
    const exif = Buffer.concat([
      Buffer.from([
        0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
        0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
      ]),
      Buffer.from(data, "utf-8"),
    ]);
    exif.writeUIntLE(new TextEncoder().encode(data).length, 14, 4);
    return exif;
  };
}
module.exports = Exif;
