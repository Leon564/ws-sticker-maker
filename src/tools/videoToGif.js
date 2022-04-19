const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { tmpdir } = require("os");
const {  readFileSync, writeFileSync, unlinkSync } = require("fs-extra");

const videoToGif = async (file, fps) => {  
  let isBuffer = Buffer.isBuffer(file);
  if (isBuffer) {
    const tempFile = tmpdir() + "/" + Date.now() + ".video";
    writeFileSync(tempFile, file);
    file = tempFile;
  }
  const dir = `${tmpdir()}/${Date.now()}.gif`;
  const fm = new ffmpeg();
  return new Promise((resolve, reject) => {
    fm.input(file)
      .noAudio()
      .videoFilter(["scale=512:-1"])
      .output(dir)
      .outputOptions([
        "-vf",
        `fps=${fps || 10}`,       
        "-loop",
        "0",
        "-preset",
        "default",        
        "-an",
        "-vsync",
        "0",
        "-fs",        
        "1MB"      
      ])
      .on("end", () => {
        let gif = readFileSync(dir);
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
module.exports = videoToGif;
