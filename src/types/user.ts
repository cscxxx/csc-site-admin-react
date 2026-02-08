/**
 * 用户相关类型定义
 */

import type { ApiResponse } from './api';

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户 ID */
  id: number;
  /** 登录 ID */
  loginId: string;
  /** 用户名称 */
  name: string;
  /** 邮箱 */
  email?: string;
  /** 头像 URL */
  avatar?: string;
  /** 角色 */
  role?: string;
  /** 状态 */
  status?: string;
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  /** 登录 ID */
  loginId: string;
  /** 登录密码 */
  loginPwd: string;
  /** 验证码 */
  captcha: string;
  /** 记住我（天数，0 表示不记住） */
  remember: number;
}

/**
 * 登录响应数据
 */
export interface LoginResponseData {
  /** 用户 ID */
  id: number;
  /** 登录 ID */
  loginId: string;
  /** 用户名称 */
  name: string;
  /** 头像 URL（可选，Mock 等场景使用） */
  avatar?: string;
}

/**
 * 登录响应（API 格式）
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

/**
 * 用户列表项（用于表格展示）
 */
export interface UserListItem extends UserInfo {
  /** 表格行 key */
  key: string;
}
