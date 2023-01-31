import {
  Background,
  Categories,
  IStickerOptions,
  Message
} from '../interfaces/types'
import { StickerTypes } from './metadata/stickertTypes'
import { writeFile } from 'fs-extra'
import converter from './converter'
export class Sticker {
  private Metadata: IStickerOptions
  private sticker: Buffer | undefined

  constructor (options?: IStickerOptions | string | Buffer) {
    if (typeof options === 'string' || options instanceof Buffer) {
      options = { image: options } as IStickerOptions
    }
    const defaults: IStickerOptions = {
      id: '',
      image: '',
      author: '',
      pack: '',
      quality: 50,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      fps: 10,
      loop: 0,
      type: 'default',
      categories: [],
      effort: 0,
      size: 512,
      duration: 10,
      fileSize: 800000
    }
    this.Metadata = { ...defaults, ...options }
    this.Metadata.type = Object.values(StickerTypes).includes(
      this.Metadata.type as StickerTypes
    )
      ? this.Metadata.type
      : 'default'
    return this
  }
  
  setAuthor (author: string) {
    this.Metadata.author = author
    return this
  }
  setPack (pack: string) {
    this.Metadata.pack = pack
    return this
  }
  setId (id: string) {
    this.Metadata.id = id
    return this
  }
  setImage (image: string | Buffer) {
    this.Metadata.image = image
    return this
  }
  setBackground (background: Background) {
    this.Metadata.background = background
    return this
  }
  setQuality (quality: number) {
    this.Metadata.quality = quality
    return this
  }
  setFps (fps: number) {
    this.Metadata.fps = fps
    return this
  }
  setLoop (loop: number) {
    this.Metadata.loop = loop
    return this
  }
  setType (type: StickerTypes | string) {
    this.Metadata.type = Object.values(StickerTypes).includes(
      type as StickerTypes
    )
      ? type
      : 'default'
    return this
  }
  setCategories (categories: Categories[]) {
    this.Metadata.categories = categories
    return this
  }
  setEffort (effort: number) {
    this.Metadata.effort = effort
    return this
  }
  setSize (size: number) {
    this.Metadata.size = size
    return this
  }
  setDuration (duration: number) {
    this.Metadata.duration = duration
    return this
  }
  setFileSize (fileSize: number) {
    this.Metadata.fileSize = fileSize
    return this
  }
  
  public get defaultFileName () {
    return `./${this.Metadata?.pack || 'sticker'}-${
      this.Metadata?.author || 'WSM'
    }.webp`
  }

  public build = async () => {
    if (this.sticker) return this.sticker
    this.sticker = await new converter(this.Metadata).build()
    return this.sticker
  }

  public toBuffer = async () => {
    if (this.sticker) return this.sticker
    return await this.build()
  }

  public toFile = async (path?: string): Promise<void> => {
    if (!this.sticker) await this.build()
    const filePath = path || this.defaultFileName
    return writeFile(filePath, this.sticker!)
  }

  public toMessage = async (): Promise<Message> => {
    if (!this.sticker) await this.build()
    return { sticker: this.sticker! }
  }
}

export const createSticker = async (
  image: string | Buffer,
  ...args: ConstructorParameters<typeof Sticker>
): Promise<Buffer> => {
  return new Sticker({ image, ...args }).build()
}
