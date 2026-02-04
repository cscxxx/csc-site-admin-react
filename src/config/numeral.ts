import numeral from 'numeral';
import 'numeral/locales/chs';

/**
 * Numeral.js 数字格式化库全局配置
 * 设置默认语言为中文（简体）
 * 参考：https://numeraljs.com/
 */

// 设置默认语言为中文（简体）
numeral.locale('chs');

/**
 * 导出配置好的 numeral 实例
 * 项目中应使用此导出的实例，而不是直接导入 numeral
 */
export { numeral };

// 默认导出 numeral 实例
export default numeral;
