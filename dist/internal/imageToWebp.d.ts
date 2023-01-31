/// <reference types="node" />
import { IConvertOptions } from '../interfaces/types';
declare const imageToWebp: (options: IConvertOptions) => Promise<Buffer>;
export default imageToWebp;
