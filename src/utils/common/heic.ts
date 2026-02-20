/**
 * HEIC/HEIF 检测与转换（基于 libheif-js，Emscripten 版 libheif）
 * 用于上传前将 HEIC 解码并转为 JPEG，便于服务端存储与预览
 */

import libheif from 'libheif-js/wasm-bundle';

const HEIC_TYPES = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'];
const HEIC_EXT = /\.(heic|heif)$/i;
/** URL 路径是否为 HEIC/HEIF（含查询串） */
const HEIC_URL_PATTERN = /\.(heic|heif)(\?|$)/i;

/**
 * 判断 URL 是否为 HEIC/HEIF 图片地址
 */
export function isHeicUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return HEIC_URL_PATTERN.test(url);
}

/**
 * 判断文件是否为 HEIC/HEIF 格式
 */
export function isHeicFile(file: File): boolean {
  const type = (file.type ?? '').toLowerCase();
  if (HEIC_TYPES.some(t => type.includes(t))) return true;
  return HEIC_EXT.test(file.name);
}

/**
 * 使用 libheif 解码 HEIC 并经 Canvas 转为 JPEG File
 */
async function decodeHeicToJpegFile(file: File): Promise<File> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const decoder = new libheif.HeifDecoder();
  const data = decoder.decode(buffer);
  if (!data || data.length === 0) {
    throw new Error('HEIC 解码失败');
  }

  const image = data[0];
  const width = image.get_width();
  const height = image.get_height();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 Canvas 上下文');
  }

  const imageData = ctx.createImageData(width, height);
  await new Promise<void>((resolve, reject) => {
    image.display(imageData, (displayData: ImageData | null) => {
      if (!displayData) {
        reject(new Error('HEIC 渲染失败'));
        return;
      }
      resolve();
    });
  });

  ctx.putImageData(imageData, 0, 0);

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('JPEG 编码失败'));
          return;
        }
        const name = file.name.replace(HEIC_EXT, '.jpg');
        resolve(new File([blob], name, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.92
    );
  });
}

/**
 * 将 HEIC/HEIF 文件转换为 JPEG File，便于上传与预览
 * @returns 转换后的 JPEG File，非 HEIC 则返回原文件
 */
export async function heicToJpegFile(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;
  return decodeHeicToJpegFile(file);
}

/**
 * 请求 HEIC 图片并转为 JPEG，返回可展示的 Object URL
 * 调用方需在不再使用时执行 URL.revokeObjectURL(url) 释放
 */
export async function fetchHeicAsJpegObjectUrl(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`请求失败: ${response.status}`);
  const blob = await response.blob();
  const file = new File([blob], 'image.heic', { type: blob.type || 'image/heic' });
  const jpegFile = await decodeHeicToJpegFile(file);
  return URL.createObjectURL(jpegFile);
}
