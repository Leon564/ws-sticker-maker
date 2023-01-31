import validator from 'validator'
import Exif from './metadata/exif'
import imageToWebp from './imageToWebp'
import { generateStickerID, getFileType, onlyEmojis } from '../tools/utils'
import downloadImage from './downloadImage'
import {
  IConvertOptions,
  IstickerConfig,
  IStickerOptions,
  Metadata
} from '../interfaces/types'

export default class converter {
  private convertOptions: IConvertOptions
  constructor (private options: IStickerOptions) {
    this.convertOptions = { ...options }
  }

  async build (): Promise<Buffer> {
    if (!this.options.image) throw new Error('File not found')
    if (!Buffer.isBuffer(this.options.image)) {
      this.options.image = validator.isURL(this.options.image)
        ? (this.options.image = await downloadImage(this.options.image))
        : this.options.image
    }
    const { ext, mime } = await getFileType(this.options.image)
    this.convertOptions.ext = ext
    this.convertOptions.fileMimeType = mime
    this.convertOptions.isAnimated = [
      'video',
      'webp',
      'gif',
      'webm',
      'mp4'
    ].includes(ext)

    const bufferWebp = await imageToWebp(this.convertOptions)
    const { author, pack, categories, id }: IstickerConfig = this.options

    const sticker = await new Exif({ author, categories, id, pack }).add(
      bufferWebp
    )
    return sticker
  }
}
