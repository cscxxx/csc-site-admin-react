/**
 * 通用类型定义
 * 项目中常用的通用类型
 */

/**
 * 菜单项配置
 */
export interface MenuItem {
  /** 菜单项唯一标识 */
  key: string;
  /** 菜单项标签 */
  label: string;
  /** 菜单项图标 */
  icon?: React.ReactNode;
  /** 路由路径 */
  path?: string;
  /** 子菜单项 */
  children?: MenuItem[];
}

/**
 * 表格列配置（基于 Ant Design Table）
 */
export interface TableColumn<T = unknown> {
  /** 列标题 */
  title: string;
  /** 数据字段名 */
  dataIndex: string;
  /** React key */
  key: string;
  /** 自定义渲染函数 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

/**
 * 选项数据
 * 用于下拉框、单选框等组件
 */
export interface OptionItem {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 键值对
 */
export interface KeyValuePair<T = string> {
  /** 键 */
  key: string;
  /** 值 */
  value: T;
}
