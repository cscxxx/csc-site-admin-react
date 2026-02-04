import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

/**
 * GSAP 动画库全局配置
 * 注册插件并设置全局默认配置
 * 参考：https://greensock.com/docs/
 */

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

/**
 * 设置 GSAP 全局默认配置
 * 这些配置将应用于所有动画，除非在具体动画中被覆盖
 */
gsap.defaults({
  // 默认动画时长（秒）
  duration: 0.5,
  // 默认缓动函数
  ease: 'power2.out',
  // 默认是否在动画开始时立即应用初始值
  immediateRender: false,
});

/**
 * 配置 ScrollTrigger 全局默认设置
 * 注意：ScrollTrigger.config() 在某些版本中可能不接受配置参数
 * 如需配置，请在创建 ScrollTrigger 实例时单独设置
 */
// ScrollTrigger.config() 已移除，因为类型定义中不包含这些配置选项

/**
 * 导出配置好的 GSAP 实例
 * 项目中应使用此导出的实例，而不是直接导入 gsap
 */
export { gsap, ScrollTrigger, MotionPathPlugin, TextPlugin };

// 默认导出 gsap 实例
export default gsap;
