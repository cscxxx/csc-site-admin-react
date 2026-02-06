/**
 * Mock 数据入口文件
 * 统一导出所有 mock 配置
 */
import type { MockConfig } from './utils';
import authMocks from './modules/auth';
import userMocks from './modules/user';
import dashboardMocks from './modules/dashboard';
import commonMocks from './modules/common';

// 合并所有 mock 配置
const mockConfigs: MockConfig[] = [...authMocks, ...userMocks, ...dashboardMocks, ...commonMocks];

export default mockConfigs;

// 导出各个模块，方便单独使用
export { authMocks, userMocks, dashboardMocks, commonMocks };

// 导出工具函数
export * from './utils';
