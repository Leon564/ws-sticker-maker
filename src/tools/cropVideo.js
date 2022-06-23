const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { tmpdir } = require("os");
const { readFileSync, writeFileSync, unlinkSync } = require("fs-extra");

const crop = async ({ image, fps, size }) => {
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
      .videoFilters([
        `crop=w='min(min(iw\,ih)\,512)':h='min(min(iw\,ih)\,512)'`,
      ])
      .outputOptions(["-fs", "750000"])
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
module.exports = crop;
