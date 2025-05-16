import sharp from "sharp";
import videoToWebp from "./videoToWebp";
import { StickerTypes } from "./metadata/stickertTypes";
import { IConvertOptions, IStickerOptions } from "../interfaces/types";
import { writeFileSync } from "fs";
import { getFileType } from "../tools/utils";

const imageToWebp = async (options: IConvertOptions): Promise<Buffer> => {
  if (options.isAnimated && options?.fileMimeType?.includes("webp"))
    return options.image as Buffer;

  const { image, fps, size, duration, fileSize, loop, fileMimeType } = options;
  if (
    options.isAnimated &&
    ["crop", "default"].includes(options.type!) &&
    options.ext !== "webp"
  ) {
    options.image = await videoToWebp({
      crop: true,
      image: image as Buffer,
      fps,
      size,
      duration,
      fileSize,
      loop,
    });
    return options.image;
  } else if (
    options.isAnimated &&
    fileMimeType?.includes("video") &&
    options.ext !== "webp"
  ) {
    options.image = await videoToWebp({
      crop: false,
      image: image as Buffer,
      fps,
      size,
      duration,
      fileSize,
      loop,
    });
  }
  const img = sharp(options.image, {
    animated: options.isAnimated ?? false,
  }).toFormat("webp");

  writeFileSync("test.webp", options.image as Buffer);
  const { ext, mime } = await getFileType(options.image!);
  console.log(ext, mime);
  //img.toFile('test.webp')
  //const { size } = options;

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
        background: options.background,
      })
      .composite([
        {
          input: Buffer.from(
              `<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="${options.background}"/></svg>`
          ),
          blend: 'dest-in',
          gravity: 'northeast',
          tile: true
      }
      ]);
  }

  await img
    .webp({
      effort: options.effort || 0,
      quality: options.quality ?? 50,
      lossless: false,
    })
    .toFile("test2.webp");

  return await img
    .webp({
      effort: options.effort || 0,
      quality: options.quality ?? 50,
      lossless: false,
    })
    .toBuffer();
};

export default imageToWebp;
