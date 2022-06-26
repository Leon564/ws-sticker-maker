const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { tmpdir } = require("os");
const { readFileSync, writeFileSync, unlinkSync, statSync } = require("fs-extra");

const videoToGif = async ({image, fps, size, duration, fileSize}) => {  
  let file = image;
  const isBuffer = Buffer.isBuffer(file);
  if (isBuffer) {
    const tempFile = tmpdir() + "/" + Date.now() + ".video";
    writeFileSync(tempFile, file);
    file = tempFile;
  }
  const dir = `${tmpdir()}/${Date.now()}.webp`;
  const fm = new ffmpeg();
  await new Promise((resolve, reject) => {
    fm.input(file)
      .noAudio()
      .fps(fps || 16)
      .size((size || "512") + "x?")
      .keepDAR()
      .videoCodec("libwebp")
      .duration(duration || 10)
      .videoFilter([`scale=${size}:-1`])
      .outputOptions([ "-fs", `${fileSize}`])      
      .format("webp")
      .output(dir)
      .on("end", () => {
        resolve(dir);
      })
      .on("error", (e) => {
        console.log(e);
        reject(e);
      })
      .run();
  });
  const media = readFileSync(dir);
  unlinkSync(dir);
  if (isBuffer) unlinkSync(file);
  return media;
};
module.exports = videoToGif;
