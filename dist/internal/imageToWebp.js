"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const videoToWebp_1 = __importDefault(require("./videoToWebp"));
const imageToWebp = (options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (options.isAnimated && ((_a = options === null || options === void 0 ? void 0 : options.fileMimeType) === null || _a === void 0 ? void 0 : _a.includes('webp')))
        return options.image;
    const { image, fps, size, duration, fileSize, loop, fileMimeType } = options;
    if (options.isAnimated &&
        ['crop', 'circle', 'default'].includes(options.type) &&
        options.ext !== 'webp') {
        options.image = yield (0, videoToWebp_1.default)({
            crop: true,
            image: image,
            fps,
            size,
            duration,
            fileSize,
            loop
        });
        return options.image;
    }
    else if (options.isAnimated &&
        (fileMimeType === null || fileMimeType === void 0 ? void 0 : fileMimeType.includes('video')) &&
        options.ext !== 'webp') {
        options.image = yield (0, videoToWebp_1.default)({
            crop: false,
            image: image,
            fps,
            size,
            duration,
            fileSize,
            loop
        });
    }
    const img = (0, sharp_1.default)(options.image, {
        animated: (_b = options.isAnimated) !== null && _b !== void 0 ? _b : false
    }).toFormat('webp');
    //const { size } = options;
    if (options.type === 'crop')
        img.resize(size, size, {
            fit: sharp_1.default.fit.cover
        });
    if (options.type === 'full')
        img.resize(size, size, {
            fit: sharp_1.default.fit.contain,
            background: options.background
        });
    if (options.type === 'circle') {
        img
            .resize(size, size, {
            fit: sharp_1.default.fit.cover
        })
            .composite([
            {
                input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${options.background}"/></svg>`),
                blend: 'dest-in'
            }
        ]);
    }
    return yield img
        .webp({
        effort: options.effort || 0,
        quality: (_c = options.quality) !== null && _c !== void 0 ? _c : 50,
        lossless: false
    })
        .toBuffer();
});
exports.default = imageToWebp;
