import { randomBytes } from 'crypto'
import { fromBuffer, fromFile } from 'file-type'

export const getFileType = async (data: string | Buffer) => {
  const type = Buffer.isBuffer(data)
    ? await fromBuffer(data)
    : await fromFile(data).catch(() => {
        return null
      })

  if (!type) {
    throw new Error('Invalid file type')
  }
  return type
}

export const generateStickerID = () => randomBytes(32).toString('hex')

export const onlyEmojis = (array: string[]) => {
  const regex = /\p{Emoji}/u
  return array.filter(x => x.match(regex))
}
