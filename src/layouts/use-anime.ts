import { useMemo } from 'react';
import type { RefObject } from 'react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from '../config/gsap';

/**
 * 标题动画配置
 */
interface TitleAnimationConfig {
  /** 动画持续时间（秒） */
  duration?: number;
  /** 跳动高度（像素） */
  jumpHeight?: number;
  /** 动画延迟（秒） */
  delay?: number;
}

/**
 * 为标题文字添加彩色跳动动画效果
 * @param wordRefs 每个单词的 ref 数组
 * @param colors 每个单词的颜色数组
 * @param config 动画配置
 */
export function useTitleAnimation(
  wordRefs: RefObject<HTMLElement | null>[],
  colors: string[],
  config: TitleAnimationConfig = {}
) {
  const { duration = 0.6, jumpHeight = -15, delay = 0.1 } = config;

  // 创建稳定的依赖项
  const colorsKey = useMemo(() => colors.join(','), [colors]);
  const refsCount = wordRefs.length;

  // 为每个单词设置颜色并创建跳动动画
  useGSAP(
    () => {
      // 检查所有 ref 是否都已准备好
      const allRefsReady = wordRefs.every(ref => ref.current);
      if (!allRefsReady || !wordRefs.length) return;

      // 设置每个单词的颜色
      wordRefs.forEach((ref, index) => {
        if (ref.current && colors[index]) {
          ref.current.style.color = colors[index];
        }
      });

      // 创建时间线，让每个单词依次跳动
      const tl = gsap.timeline({
        repeat: -1, // 无限循环
        repeatDelay: 1, // 每次循环之间的延迟
      });

      // 为每个单词添加跳动动画
      wordRefs.forEach((ref, index) => {
        if (!ref.current) return;

        // 初始状态：设置变换原点
        gsap.set(ref.current, {
          transformOrigin: 'center bottom',
        });

        // 添加到时间线：向上跳动然后回弹
        tl.to(
          ref.current,
          {
            y: jumpHeight,
            scale: 1.1,
            duration: duration * 0.4,
            ease: 'power2.out',
          },
          index * delay // 每个单词的延迟时间
        ).to(
          ref.current,
          {
            y: 0,
            scale: 1,
            duration: duration * 0.6,
            ease: 'bounce.out',
          },
          index * delay + duration * 0.4
        );
      });
    },
    { dependencies: [refsCount, colorsKey] }
  );
}
