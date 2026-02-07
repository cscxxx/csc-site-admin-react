import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

/**
 * Ant Design 主题配置
 * 主题：柔和护眼（低饱和度、不刺眼）
 */
export const themeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,

  token: {
    colorPrimary: '#5B8A72',
    colorPrimaryHover: '#4A7560',
    colorSuccess: '#5B8A72',
    colorWarning: '#B8956B',
    colorError: '#B87A7A',
    colorBgLayout: '#F2F4F3',
    colorBgContainer: '#FAFBFA',
    colorText: '#3D4540',
    colorTextSecondary: '#6B736E',
    colorBorder: '#DDE3E0',
    borderRadius: 6,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
    wireframe: false,
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
