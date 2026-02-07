/**
 * Banner Mock 数据
 * 用于开发时模拟 API 响应
 */

import { successResponse, delay } from '@/mock/utils';
import type { BannerItem, BannerSubmitItem, ApiResponse } from '@/types';

/**
 * 获取 Banner 列表 Mock
 * @returns Banner 列表数据
 */
export async function getBannerListMock(): Promise<BannerItem[]> {
  await delay(300);

  const mockData: BannerItem[] = [
    {
      id: 1,
      midImg: '/static/images/bg1_mid.jpg',
      bigImg: '/static/images/bg1_big.jpg',
      title: '塞尔达旷野之息',
      description: '2017年年度游戏，期待续作，2222',
    },
    {
      id: 2,
      midImg: '/static/images/bg2_mid.jpg',
      bigImg: '/static/images/bg2_big.jpg',
      title: '塞尔达四英杰',
      description: '四英杰里面你最喜欢的又是谁呢',
    },
    {
      id: 3,
      midImg: '/static/images/bg3_mid.jpg',
      bigImg: '/static/images/bg3_big.jpeg',
      title: '日本街道',
      description: '动漫中经常出现的日本农村街道，一份独特的恬静',
    },
  ];

  return successResponse(mockData).data;
}

/**
 * 更新 Banner 列表 Mock
 * @param data Banner 提交数据数组（不包含 id）
 * @returns 更新结果
 */
export async function updateBannerListMock(
  data: BannerSubmitItem[]
): Promise<ApiResponse<unknown>> {
  await delay(300);

  return successResponse(
    {
      updated: Array.isArray(data) ? data.length : 0,
      updateTime: new Date().toISOString(),
    },
    '更新成功'
  );
}
