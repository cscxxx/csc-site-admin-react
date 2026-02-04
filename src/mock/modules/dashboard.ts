/**
 * 仪表盘相关 API Mock
 */
import Mock from 'mockjs';
import type { MockConfig } from '../utils';
import { successResponse, delay } from '../utils';

const dashboardMocks: MockConfig[] = [
  // 获取统计数据
  {
    url: '/api/dashboard/statistics',
    method: 'get',
    response: async () => {
      await delay(300);

      return successResponse({
        totalUsers: Mock.Random.integer(1000, 5000),
        totalOrders: Mock.Random.integer(5000, 20000),
        totalRevenue: Mock.Random.float(100000, 1000000, 2, 2),
        growthRate: Mock.Random.float(5, 20, 1, 1),
        todayUsers: Mock.Random.integer(50, 500),
        todayOrders: Mock.Random.integer(100, 1000),
        todayRevenue: Mock.Random.float(10000, 100000, 2, 2),
      });
    },
  },

  // 获取图表数据
  {
    url: '/api/dashboard/chart',
    method: 'get',
    response: async ({ query }) => {
      await delay(400);

      const type = query?.type || 'line';
      const days = Number(query?.days) || 7;

      // 生成日期数组
      const dates: string[] = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      if (type === 'line') {
        // 折线图数据
        return successResponse({
          dates,
          series: [
            {
              name: '用户数',
              data: dates.map(() => Mock.Random.integer(100, 1000)),
            },
            {
              name: '订单数',
              data: dates.map(() => Mock.Random.integer(200, 2000)),
            },
          ],
        });
      } else if (type === 'bar') {
        // 柱状图数据
        return successResponse({
          categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: Array.from({ length: 7 }, () => Mock.Random.integer(100, 1000)),
        });
      } else {
        // 饼图数据
        return successResponse({
          data: [
            { name: '技术部', value: Mock.Random.integer(100, 500) },
            { name: '产品部', value: Mock.Random.integer(100, 500) },
            { name: '运营部', value: Mock.Random.integer(100, 500) },
            { name: '市场部', value: Mock.Random.integer(100, 500) },
          ],
        });
      }
    },
  },

  // 获取最近活动
  {
    url: '/api/dashboard/activities',
    method: 'get',
    response: async ({ query }) => {
      await delay(300);

      const limit = Number(query?.limit) || 10;

      return successResponse(
        Mock.mock({
          [`list|${limit}`]: [
            {
              id: '@id',
              type: '@pick(["用户注册", "订单创建", "支付完成", "系统通知"])',
              user: '@cname',
              description: '@cparagraph(1)',
              time: '@datetime("yyyy-MM-dd HH:mm:ss")',
              avatar: '@image("50x50", "@color", "@name")',
            },
          ],
        }).list
      );
    },
  },
];

export default dashboardMocks;
