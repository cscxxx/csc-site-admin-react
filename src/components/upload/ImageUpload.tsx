/**
 * 通用图片上传组件
 * 单文件上传，支持 HEIC 自动转 JPEG 后上传与预览，最大 100MB
 */

import { useCallback, useState } from 'react';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadImage } from './service';
import { heicToJpegFile } from '@/utils/common/heic';
import type { ImageUploadProps } from './types';
import styles from './index.module.less';

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPT_IMAGES = 'image/*,image/heic,image/heif,.heic,.heif';

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  placeholder = '点击或拖拽图片到此区域上传',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleCustomRequest = useCallback<NonNullable<UploadProps['customRequest']>>(
    async options => {
      const { file, onSuccess, onError } = options;
      const rawFile = file as File;

      if (rawFile.size > MAX_SIZE) {
        message.error('图片大小不能超过 100MB');
        onError?.(new Error('FILE_SIZE_EXCEEDED'));
        return;
      }

      setUploading(true);
      try {
        const fileToUpload = await heicToJpegFile(rawFile);
        const url = await uploadImage(fileToUpload);
        onSuccess?.(url);
        onChange?.(url);
      } catch (err) {
        const messageText = err instanceof Error ? err.message : '上传失败';
        message.error(messageText);
        onError?.(err instanceof Error ? err : new Error(messageText));
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`.trim()}>
      {value ? (
        <div className={styles.preview}>
          <img src={value} alt="预览" className={styles.previewImage} />
          {!disabled && (
            <button
              type="button"
              className={styles.remove}
              onClick={handleRemove}
              aria-label="删除图片"
            >
              删除
            </button>
          )}
        </div>
      ) : (
        <Upload.Dragger
          disabled={disabled}
          accept={ACCEPT_IMAGES}
          maxCount={1}
          showUploadList={false}
          customRequest={handleCustomRequest}
          className={styles.dragger}
        >
          <p className={styles.placeholderIcon}>
            {uploading ? <LoadingOutlined spin /> : <InboxOutlined />}
          </p>
          <p className={styles.placeholderText}>{uploading ? '正在处理…' : placeholder}</p>
          <p className={styles.placeholderHint}>
            支持 JPG/PNG/HEIC 等，单张不超过 100MB，HEIC 将自动转为 JPG
          </p>
        </Upload.Dragger>
      )}
    </div>
  );
}
