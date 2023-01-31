import { tmpdir } from 'os'
import { readFileSync, writeFileSync, unlinkSync } from 'fs-extra'
import { VideoOptios } from '../interfaces/types'
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import Ffmpeg from 'fluent-ffmpeg'
Ffmpeg.setFfmpegPath(ffmpegPath)

const videoToWebp = async (options: VideoOptios) => {
  const { image, fps, size, duration, fileSize, loop, crop } = options
  const filter = crop
    ? [`crop=w='min(min(iw\,ih)\,512)':h='min(min(iw\,ih)\,512)'`]
    : [`scale=${size}:-1`]
  let file = image
  const isBuffer = Buffer.isBuffer(file)
  if (isBuffer) {
    const tempFile = tmpdir() + '/' + Date.now() + '.video'
    writeFileSync(tempFile, file)
    file = tempFile
  }
  const dir = `${tmpdir()}/${Date.now()}.webp`
  await new Promise((resolve, reject) => {
    Ffmpeg(file as string)
      .noAudio()
      .fps(fps || 16)
      .size((size || '512') + 'x?')
      .keepDAR()
      .duration(duration || 10)
      .videoCodec('libwebp')
      //.videoFilter([`scale=${size}:-1`])
      .videoFilters(filter)
      .outputOptions(['-fs', `${fileSize}`, '-loop', `${loop}`])
      .format('webp')
      .output(dir)
      .on('end', () => {
        resolve(dir)
      })
      .on('error', e => {
        console.log(e)
        reject(e)
      })
      .run()
  })
  const media = readFileSync(dir)
  unlinkSync(dir)
  if (isBuffer) unlinkSync(file)
  return media
}

export default videoToWebp
