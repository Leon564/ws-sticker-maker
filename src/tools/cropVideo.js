const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { tmpdir } = require("os");
const { readFileSync, writeFileSync, unlinkSync } = require("fs-extra");

const crop = async ({image, fps, size}) => {
  let file = image;
  const isBuffer = Buffer.isBuffer(file);
  if (isBuffer) {
    const tempFile = tmpdir() + "/" + Date.now() + ".video";
    writeFileSync(tempFile, file);
    file = tempFile;
  }
  const dir = `${tmpdir()}/${Date.now()}.webp`;
  const fm = new ffmpeg();
  return new Promise((resolve, reject) => {
    fm.input(file)
      .keepDAR()
      .noAudio()
      .fps(fps || 16)
      .size((size || "250") + "x?")
      .aspect("1:1")
      .keepDAR()
      .videoFilters([
        `crop=w='min(min(iw\,ih)\,512)':h='min(min(iw\,ih)\,512)'`,
      ])
      .format("webp")
      .outputOptions(["-fs", "1000000"])
      .output(dir)
      .on("end", () => {
        const gif = readFileSync(dir);
        unlinkSync(dir);
        if (isBuffer) unlinkSync(file);
        return resolve(gif);
      })
      .on("error", (e) => {
        console.log(e);
        return reject(e);
      })
      .run();
  });
};
module.exports = crop;
