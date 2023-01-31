import { IRawMetadata, IStickerOptions, Metadata } from '../../interfaces/types'
import { generateStickerID } from '../../tools/utils'

export default class RawMetadata implements IRawMetadata {
  emojis: string[]
  'sticker-pack-id': string
  'sticker-pack-name': string
  'sticker-pack-publisher': string
  constructor (options: Metadata) {
    this['sticker-pack-id'] = options.id || generateStickerID()
    this['sticker-pack-name'] = options.pack || ''
    this['sticker-pack-publisher'] = options.author || ''
    this.emojis = options.categories || []
  }
}
