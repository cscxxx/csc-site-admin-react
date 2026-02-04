/**
 * 通用 API Mock
 */
import Mock from 'mockjs';
import type { MockConfig } from '../utils';
import { successResponse, errorResponse, delay } from '../utils';

const commonMocks: MockConfig[] = [
  // 上传文件
  {
    url: '/api/upload',
    method: 'post',
    response: async () => {
      await delay(800); // 模拟上传延迟

      return successResponse({
        url: Mock.Random.image('800x600', Mock.Random.color(), 'Upload'),
        filename: Mock.Random.word() + '.' + Mock.Random.pick(['jpg', 'png', 'gif']),
        size: Mock.Random.integer(10000, 5000000),
        uploadTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      });
    },
  },

  // 获取系统配置
  {
    url: '/api/settings',
    method: 'get',
    response: async () => {
      await delay(200);

      return successResponse({
        siteName: 'CSC Site',
        siteDescription: '这是一个示例网站',
        emailNotifications: true,
        smsNotifications: false,
        theme: 'light',
        language: 'zh-CN',
      });
    },
  },

  // 更新系统配置
  {
    url: '/api/settings',
    method: 'put',
    response: async ({ body }) => {
      await delay(300);

      return successResponse(
        {
          ...(typeof body === 'object' && body !== null ? body : {}),
          updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        },
        '设置保存成功'
      );
    },
  },

  // 404 处理
  {
    url: /^\/api\/.*$/,
    method: 'get',
    response: async ({ url }) => {
      await delay(200);
      return errorResponse(`接口 ${url} 不存在`, 404);
    },
  },
];

export default commonMocks;
