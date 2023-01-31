/// <reference types="node" />
import { StickerTypes } from '../internal/metadata/stickertTypes';
export type Background = {
    r: number;
    g: number;
    b: number;
    alpha: number;
};
export interface IstickerConfig {
    pack?: string;
    author?: string;
    id?: string;
    categories?: Categories[];
}
export interface IStickerOptions extends IstickerConfig {
    image?: string | Buffer;
    background?: Background;
    fps?: number;
    loop?: number;
    quality?: number;
    type?: StickerTypes | string;
    effort?: number;
    size?: number;
    duration?: number;
    fileSize?: number;
}
export interface IConvertOptions extends IStickerOptions {
    isAnimated?: boolean;
    fileMimeType?: string;
    ext?: string;
}
export type Message = {
    sticker: Buffer;
};
export type Metadata = IstickerConfig | IStickerOptions;
export interface IRawMetadata {
    emojis: string[];
    'sticker-pack-id': string;
    'sticker-pack-name': string;
    'sticker-pack-publisher': string;
}
export type VideoOptios = {
    image: Buffer | string;
    fps?: number;
    size?: number;
    duration?: number;
    fileSize?: number;
    loop?: number;
    crop?: boolean;
};
type Love = '❤' | '😍' | '😘' | '💕' | '😻' | '💑' | '👩‍❤‍👩' | '👨‍❤‍👨' | '💏' | '👩‍❤‍💋‍👩' | '👨‍❤‍💋‍👨' | '🧡' | '💛' | '💚' | '💙' | '💜' | '🖤' | '💔' | '❣' | '💞' | '💓' | '💗' | '💖' | '💘' | '💝' | '💟' | '♥' | '💌' | '💋' | '👩‍❤️‍💋‍👩' | '👨‍❤️‍💋‍👨' | '👩‍❤️‍👨' | '👩‍❤️‍👩' | '👨‍❤️‍👨' | '👩‍❤️‍💋‍👨' | '👬' | '👭' | '👫' | '🥰' | '😚' | '😙' | '👄' | '🌹' | '😽' | '❣️' | '❤️';
type Happy = '😀' | '😃' | '😄' | '😁' | '😆' | '😅' | '😂' | '🤣' | '🙂' | '😛' | '😝' | '😜' | '🤪' | '🤗' | '😺' | '😸' | '😹' | '☺' | '😌' | '😉' | '🤗' | '😊';
type Sad = '☹' | '😣' | '😖' | '😫' | '😩' | '😢' | '😭' | '😞' | '😔' | '😟' | '😕' | '😤' | '😠' | '😥' | '😰' | '😨' | '😿' | '😾' | '😓' | '🙍‍♂' | '🙍‍♀' | '💔' | '🙁' | '🥺' | '🤕' | '☔️' | '⛈' | '🌩' | '🌧';
type Angry = '😯' | '😦' | '😧' | '😮' | '😲' | '🙀' | '😱' | '🤯' | '😳' | '❗' | '❕' | '🤬' | '😡' | '😠' | '🙄' | '👿' | '😾' | '😤' | '💢' | '👺' | '🗯️' | '😒' | '🥵';
type Greet = '👋';
type Celebrate = '🎊' | '🎉' | '🎁' | '🎈' | '👯‍♂️' | '👯' | '👯‍♀️' | '💃' | '🕺' | '🔥' | '⭐️' | '✨' | '💫' | '🎇' | '🎆' | '🍻' | '🥂' | '🍾' | '🎂' | '🍰';
export type Categories = Love | Happy | Sad | Angry | Greet | Celebrate;
export {};
