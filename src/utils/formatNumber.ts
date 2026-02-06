import numeral from '../config/numeral';

/**
 * 货币格式化选项
 */
export interface CurrencyOptions {
  /** 小数位数，默认 2 */
  decimals?: number;
  /** 是否显示符号，默认 true */
  showSymbol?: boolean;
  /** 自定义符号，默认 '¥' */
  symbol?: string;
}

/**
 * 百分比格式化选项
 */
export interface PercentageOptions {
  /** 小数位数，默认 1 */
  decimals?: number;
  /** 是否显示百分号，默认 true */
  showSymbol?: boolean;
}

/**
 * 数字格式化选项
 */
export interface NumberOptions {
  /** 小数位数 */
  decimals?: number;
  /** 是否使用千分位分隔符，默认 true */
  useThousandsSeparator?: boolean;
}

/**
 * 货币格式化
 * @param value 要格式化的数字
 * @param options 格式化选项
 * @returns 格式化后的货币字符串，如 "¥1,234.56"
 *
 * @example
 * formatCurrency(112893) // "¥112,893.00"
 * formatCurrency(112893, { decimals: 0 }) // "¥112,893"
 * formatCurrency(112893, { symbol: '$' }) // "$112,893.00"
 */
export function formatCurrency(value: number | string, options: CurrencyOptions = {}): string {
  const { decimals = 2, showSymbol = true, symbol = '¥' } = options;

  const format = decimals === 0 ? '0,0' : `0,0.${'0'.repeat(decimals)}`;
  let formatted = numeral(value).format(format);

  if (showSymbol) {
    formatted = `${symbol}${formatted}`;
  }

  return formatted;
}

/**
 * 百分比格式化
 * @param value 要格式化的数字（如 9.3 表示 9.3%）
 * @param options 格式化选项
 * @returns 格式化后的百分比字符串，如 "9.3%"
 *
 * @example
 * formatPercentage(9.3) // "9.3%"
 * formatPercentage(9.345, { decimals: 2 }) // "9.35%"
 * formatPercentage(9.3, { showSymbol: false }) // "9.3"
 */
export function formatPercentage(value: number | string, options: PercentageOptions = {}): string {
  const { decimals = 1, showSymbol = true } = options;

  const format = decimals === 0 ? '0' : `0.${'0'.repeat(decimals)}`;
  let formatted = numeral(value).format(format);

  if (showSymbol) {
    formatted = `${formatted}%`;
  }

  return formatted;
}

/**
 * 通用数字格式化（千分位分隔）
 * @param value 要格式化的数字
 * @param options 格式化选项
 * @returns 格式化后的数字字符串，如 "1,234,567"
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.567, { decimals: 2 }) // "1,234.57"
 * formatNumber(1234567, { useThousandsSeparator: false }) // "1234567"
 */
export function formatNumber(value: number | string, options: NumberOptions = {}): string {
  const { decimals, useThousandsSeparator = true } = options;

  if (decimals !== undefined) {
    const format = useThousandsSeparator
      ? decimals === 0
        ? '0,0'
        : `0,0.${'0'.repeat(decimals)}`
      : decimals === 0
        ? '0'
        : `0.${'0'.repeat(decimals)}`;
    return numeral(value).format(format);
  }

  const format = useThousandsSeparator ? '0,0' : '0';
  return numeral(value).format(format);
}

/**
 * 小数格式化
 * @param value 要格式化的数字
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的小数字符串，如 "123.45"
 *
 * @example
 * formatDecimal(123.456) // "123.46"
 * formatDecimal(123.456, 1) // "123.5"
 * formatDecimal(123, 2) // "123.00"
 */
export function formatDecimal(value: number | string, decimals: number = 2): string {
  const format = decimals === 0 ? '0' : `0.${'0'.repeat(decimals)}`;
  return numeral(value).format(format);
}

/**
 * 文件大小格式化
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的文件大小字符串，如 "1.23 MB"
 *
 * @example
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${formatDecimal(bytes / Math.pow(k, i), decimals)} ${sizes[i]}`;
}

/**
 * 缩写数字格式化（如：1.2K, 1.5M）
 * @param value 要格式化的数字
 * @param decimals 小数位数，默认 1
 * @returns 格式化后的缩写数字字符串，如 "1.2K"
 *
 * @example
 * formatAbbreviated(1200) // "1.2K"
 * formatAbbreviated(1500000) // "1.5M"
 */
export function formatAbbreviated(value: number | string, decimals: number = 1): string {
  const format = decimals === 0 ? '0a' : `0.${'0'.repeat(decimals)}a`;
  return numeral(value).format(format);
}
