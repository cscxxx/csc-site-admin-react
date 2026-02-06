import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

/**
 * Ant Design 主题配置
 * 使用 Ant Design 官网推荐的默认主题设置
 * 参考：https://ant.design/docs/react/customize-theme
 */
export const themeConfig: ThemeConfig = {
  // 使用 Ant Design 官网默认算法
  algorithm: theme.defaultAlgorithm,

  // Ant Design 官网默认的设计令牌配置
  token: {
    // 主色：Ant Design 官网默认蓝色
    colorPrimary: '#1677ff',
    // 圆角：Ant Design 官网默认值
    borderRadius: 6,
    // 字体：Ant Design 官网默认字体栈
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
    // 其他官网推荐的默认配置
    wireframe: false, // 使用实心样式（官网默认）
  },

  // 组件级别的主题定制（使用官网默认配置）
  components: {
    // Button 组件使用官网默认配置
    Button: {
      borderRadius: 6,
    },
    // Input 组件使用官网默认配置
    Input: {
      borderRadius: 6,
    },
    // Card 组件使用官网默认配置
    Card: {
      borderRadius: 8,
    },
  },
};
