/**
 * 通用图片上传组件
 * 单文件上传，最大 2MB，请求头携带 token
 */

import { useCallback } from 'react';
import { Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadImage } from './service';
import type { ImageUploadProps } from './types';
import styles from './index.module.less';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPT_IMAGES = 'image/*';

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  placeholder = '点击或拖拽图片到此区域上传',
  className,
}: ImageUploadProps) {
  const handleCustomRequest = useCallback<NonNullable<UploadProps['customRequest']>>(
    async options => {
      const { file, onSuccess, onError } = options;
      const rawFile = file as File;

      if (rawFile.size > MAX_SIZE) {
        message.error('图片大小不能超过 2MB');
        onError?.(new Error('FILE_SIZE_EXCEEDED'));
        return;
      }

      try {
        const url = await uploadImage(rawFile);
        onSuccess?.(url);
        onChange?.(url);
      } catch (err) {
        const messageText = err instanceof Error ? err.message : '上传失败';
        message.error(messageText);
        onError?.(err instanceof Error ? err : new Error(messageText));
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
            <InboxOutlined />
          </p>
          <p className={styles.placeholderText}>{placeholder}</p>
          <p className={styles.placeholderHint}>仅支持单张图片，大小不超过 2MB</p>
        </Upload.Dragger>
      )}
    </div>
  );
}
