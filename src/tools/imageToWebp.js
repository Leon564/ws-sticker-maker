const sharp = require("sharp");
const cropVideo = require("./cropVideo");
const stickerTypes = require("../dist/metadata/stickerTypes");
const videoToGif = require("./videoToGif");

const towebp = async (options) => {
  if (options.isAnimated && ["crop", "circle"].includes(options.type)) {
    options.image = await cropVideo(options.image, options.fps);
    options.type =
      options.type === "circle" ? stickerTypes.CIRCLE : stickerTypes.CROPPED;      
  } else if (options.isAnimated && options?.FileMime?.includes("video")) {
    options.image = await videoToGif(options.image, options.fps);
    options.type =
      options.type == "default" ? stickerTypes.CROPPED : options.type;
  }
  const img = sharp(options.image, {
    animated: options.isAnimated ?? false,
  }).toFormat("webp");

  if (options.type === "crop")
    img.resize(512, 512, {
      fit: sharp.fit.cover,
    });

  if (options.type === "full")
    img.resize(512, 512, {
      fit: sharp.fit.contain,
      background: options.background,
    });

  if (options.type === "circle") {
    img
      .resize(512, 512, {
        fit: sharp.fit.cover,
      })
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="${options.background}"/></svg>`
          ),
          blend: "dest-in",
        },
      ]);
  }
  
  return await img
    .webp({
      effort: 6,
      quality: options.quality ?? 50,
      lossless: false,
    })
    .toBuffer();
};

module.exports = towebp;
