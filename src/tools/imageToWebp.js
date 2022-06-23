const sharp = require("sharp");
const cropVideo = require("./cropVideo");
const stickerTypes = require("../dist/metadata/stickerTypes");
const videoToGif = require("./videoToWebp");

const towebp = async (options) => {
  if (
    options.isAnimated &&
    ["crop", "circle", "default"].includes(options.type)
  ) {
    options.image = await cropVideo(options);
    return options.image;
  } else if (options.isAnimated && options?.FileMime?.includes("video")) {
    options.image = await videoToGif(options);
  }
  const img = sharp(options.image, {
    animated: options.isAnimated ?? false,
  }).toFormat("webp");

  const { size } = options;

  if (options.type === "crop")
    img.resize(size, size, {
      fit: sharp.fit.cover,
    });

  if (options.type === "full")
    img.resize(size, size, {
      fit: sharp.fit.contain,
      background: options.background,
    });

  if (options.type === "circle") {
    img
      .resize(size, size, {
        fit: sharp.fit.cover,
      })
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${
              size / 2
            }" cy="${size / 2}" r="${size / 2}" fill="${
              options.background
            }"/></svg>`
          ),
          blend: "dest-in",
        },
      ]);
  }

  return await img
    .webp({
      effort: options.effort || 0,
      quality: options.quality ?? 50,
      lossless: false,
    })
    .toBuffer();
};

module.exports = towebp;
