const { Sticker, stickerType } = require("../src");

//Input can be a file, buffer or a link to an image

//Sticker to file
await new Sticker("image.jpg")
  .setAuthor("me")
  .setPack("random")
  .setQuality(80)
  .setCategories(["😁", "😀"])
  .setId("123456")
  .setType(stickerType.DEFAULT) //In the default type the image will not suffer size changes when converting
  .toFile("./image.webp");

//Sticker to buffer
const stickerBuffer = await new Sticker("image.jpg")
  .setAuthor("me")
  .setPack("random")
  .setQuality(80)
  .setCategories(["😁", "😀"])
  .setId("123456")
  .setType(stickerType.CROPPED) //In the cropped type the image will be cut to fit the standard size of the stickers
  .toBuffer();

//Sticker to buffer
const message = await new Sticker("image.jpg")
  .setAuthor("me")
  .setPack("random")
  .setQuality(80)
  .setCategories(["😁", "😀"])
  .setId("123456")
  .setType(stickerType.CROPPED) //In the cropped type the image will be cut to fit the standard size of the stickers
  .toMessage(); // Returns {sticker:buffer} format for messages from Baileys

//Animated sticker options
const Buffer = await new Sticker("image.gif")
  .setAuthor("me")
  .setPack("random")
  .setQuality(10) //If the output file exceeds 1mb you can adjust the output quality (Recommended: 10 - 20)
  .setFps(10) //You can also change the fps rate of the input video or gif (default value is 10)
  .setCategories(["😁", "😀"])
  .setId("123456")
  .setType(stickerType.FULL) //In the full type the image will be adjusted without cropping or deforming it so a background color can be established
  .setBackground("#ffffff") //You can also set a background color for the sticker (default is transparent)
  .toBuffer();

//Circular sticker
const StkBuffer = await new Sticker("image.jpg")
  .setAuthor("me")
  .setPack("random")
  .setQuality(80)
  .setCategories(["😁", "😀"])
  .setId("123456")
  .setType(stickerType.CIRCLE) //the image is cropped in a circular shape, a background can be set or it is transparent by default (in animated stickers it may not have the expected effect)
  .toBuffer();
