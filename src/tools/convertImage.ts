import sharp from "sharp";
import { StickerToImageOptions, Background } from "../interfaces/types";

export async function convertImage(
  inputPath: string | Buffer,
  options: StickerToImageOptions
): Promise<Buffer> {
  let image = sharp(inputPath);

  if (options.size) {
    image = image.resize(options.size);
  }

  if (options.format) {
    image = image.toFormat(options.format);
  }

  if (options.quality) {
    image = image.jpeg({ quality: options.quality });
  }

  if (options.background) {
    const { r, g, b, alpha } = options.background as Background;
    image = image.flatten({ background: { r, g, b, alpha } });
  }

  return await image.toBuffer();
}
