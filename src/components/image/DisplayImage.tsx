/**
 * 通用图片展示组件
 * 支持 HEIC/HEIF 格式自动转码为可预览的 JPEG
 * 适用于表格、列表等场景的图片展示
 */

import { useEffect, useState } from 'react';
import { Image, Spin } from 'antd';
import type { ImageProps } from 'antd';
import { fetchHeicAsJpegObjectUrl, isHeicUrl } from '@/utils/common/heic';
import styles from './index.module.less';

export interface DisplayImageProps extends Omit<ImageProps, 'src'> {
  /** 图片地址，支持 HEIC/HEIF 格式 */
  url: string | null | undefined;
  /** 图片描述 */
  alt: string;
  /** 是否显示预览功能 */
  preview?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 通用图片展示组件
 * - 自动处理 HEIC/HEIF 格式，转换为可预览的 JPEG
 * - 支持加载状态和占位符
 * - 兼容 Ant Design Image 组件的其他属性
 */
export function DisplayImage({
  url,
  alt,
  width = 100,
  height = 60,
  preview = true,
  style,
  className,
  ...restProps
}: DisplayImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      queueMicrotask(() => {
        setDisplaySrc(null);
        setLoading(false);
      });
      return;
    }
    if (!isHeicUrl(url)) {
      queueMicrotask(() => {
        setDisplaySrc(url);
        setLoading(false);
      });
      return;
    }
    queueMicrotask(() => setLoading(true));
    let objectUrl: string | null = null;
    fetchHeicAsJpegObjectUrl(url)
      .then((u: string) => {
        objectUrl = u;
        setDisplaySrc(u);
      })
      .catch(() => setDisplaySrc(url))
      .finally(() => setLoading(false));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (!url) {
    return null;
  }

  const placeholder = (
    <div className={styles.imagePlaceholder}>
      <Spin size="small" />
    </div>
  );

  return (
    <div className={`${styles.imageWrapper} ${className ?? ''}`.trim()}>
      <Image
        src={displaySrc ?? undefined}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: 'cover', borderRadius: 4, ...style }}
        preview={preview && !!displaySrc}
        loading="lazy"
        placeholder={loading ? placeholder : undefined}
        {...restProps}
      />
    </div>
  );
}
