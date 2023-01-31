import sharp from 'sharp'
import videoToWebp from './videoToWebp'
import { StickerTypes } from './metadata/stickertTypes'
import { IConvertOptions, IStickerOptions } from '../interfaces/types'

const imageToWebp = async (options: IConvertOptions): Promise<Buffer> => {
  if (options.isAnimated && options?.fileMimeType?.includes('webp'))
    return options.image as Buffer

  const { image, fps, size, duration, fileSize, loop, fileMimeType } = options
  if (
    options.isAnimated &&
    ['crop', 'circle', 'default'].includes(options.type!) &&
    options.ext !== 'webp'
  ) {
    options.image = await videoToWebp({
      crop: true,
      image: image as Buffer,
      fps,
      size,
      duration,
      fileSize,
      loop
    })
    return options.image
  } else if (
    options.isAnimated &&
    fileMimeType?.includes('video') &&
    options.ext !== 'webp'
  ) {
    options.image = await videoToWebp({
      crop: false,
      image: image as Buffer,
      fps,
      size,
      duration,
      fileSize,
      loop
    })
  }
  const img = sharp(options.image, {
    animated: options.isAnimated ?? false
  }).toFormat('webp')

  //const { size } = options;

  if (options.type === 'crop')
    img.resize(size, size, {
      fit: sharp.fit.cover
    })

  if (options.type === 'full')
    img.resize(size, size, {
      fit: sharp.fit.contain,
      background: options.background
    })

  if (options.type === 'circle') {
    img
      .resize(size, size, {
        fit: sharp.fit.cover
      })
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${
              size! / 2
            }" cy="${size! / 2}" r="${size! / 2}" fill="${
              options.background
            }"/></svg>`
          ),
          blend: 'dest-in'
        }
      ])
  }

  return await img
    .webp({
      effort: options.effort || 0,
      quality: options.quality ?? 50,
      lossless: false
    })
    .toBuffer()
}

export default imageToWebp
