const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { tmpdir } = require("os");
const { readFileSync, writeFileSync, unlinkSync, statSync } = require("fs-extra");

const videoToGif = async ({image, fps, size}) => {  
  let file = image;
  const isBuffer = Buffer.isBuffer(file);
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
      .keepDAR()
      .size((size||"250")+"x?")
      .aspect("1:1")      
      .fps(fps||16)     
      .outputOptions(["-fs","1000000"])    
      .output(dir)    
      .format("gif")  
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
module.exports = videoToGif;
