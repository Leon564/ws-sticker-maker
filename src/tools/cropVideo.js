const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const { tmpdir } = require("os");
const { readFileSync, writeFileSync, unlinkSync} = require("fs-extra");

const crop = async (file, fps) => {
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
      .outputOptions([
        "-vf",
        `crop=w='min(min(iw\,ih)\,500)':h='min(min(iw\,ih)\,500)',scale=500:500,setsar=1,fps=${fps || 10}`,
        "-loop",
        "0",
        "-preset",
        "default",
        "-an",
        "-vsync",
        "0",
        "-fs",        
        "1MB",
        "-s",
        "512:512",
      ])
      .output(dir)
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
module.exports = crop;
