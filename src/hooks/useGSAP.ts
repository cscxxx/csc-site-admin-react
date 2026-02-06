import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

/**
 * useGSAP Hook 的配置选项
 */
export interface UseGSAPOptions {
  /**
   * 作用域元素，可以是 ref 对象或选择器字符串
   * 如果提供 ref，动画将在该元素内执行
   */
  scope?: RefObject<HTMLElement | null> | RefObject<Element | null> | string;

  /**
   * 依赖项数组，当依赖项变化时重新执行动画
   * 类似于 useEffect 的依赖项
   */
  dependencies?: React.DependencyList;

  /**
   * 是否在组件挂载时立即执行动画
   * 默认为 true
   */
  immediate?: boolean;
}

/**
 * GSAP React Hook
 *
 * 在 React 组件中使用 GSAP 动画的便捷 Hook
 * 自动处理动画的清理，避免内存泄漏
 *
 * @param callback 执行 GSAP 动画的函数
 * @param options 配置选项
 *
 * @example
 * ```tsx
 * import { useGSAP } from '@/hooks/useGSAP'
 * import gsap from 'gsap'
 *
 * function MyComponent() {
 *   const ref = useRef<HTMLDivElement>(null)
 *
 *   useGSAP(() => {
 *     gsap.from(ref.current, { opacity: 0, y: 20, duration: 1 })
 *   }, { scope: ref })
 *
 *   return <div ref={ref}>Animated content</div>
 * }
 * ```
 *
 * @example 使用 ScrollTrigger
 * ```tsx
 * import { useGSAP } from '@/hooks/useGSAP'
 * import gsap from 'gsap'
 * import { ScrollTrigger } from '@/config/gsap'
 *
 * function MyComponent() {
 *   const ref = useRef<HTMLDivElement>(null)
 *
 *   useGSAP(() => {
 *     gsap.to(ref.current, {
 *       scrollTrigger: {
 *         trigger: ref.current,
 *         start: 'top center',
 *         end: 'bottom center',
 *         scrub: true
 *       },
 *       x: 100,
 *       opacity: 1
 *     })
 *   }, { scope: ref })
 *
 *   return <div ref={ref}>Animated content</div>
 * }
 * ```
 */
export function useGSAP(
  callback: (context?: gsap.Context) => void,
  options: UseGSAPOptions = {}
): void {
  const { scope, dependencies = [], immediate = true } = options;

  const ctxRef = useRef<gsap.Context | null>(null);
  const callbackRef = useRef(callback);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // 保持 callback 引用最新（在 effect 中更新，避免在渲染期间访问 ref）
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // 如果不是立即执行且组件已挂载，跳过首次执行
    if (!immediate && !isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    isMountedRef.current = true;

    // 创建 GSAP 上下文
    let context: gsap.Context;

    if (typeof scope === 'string') {
      // 如果 scope 是字符串选择器
      context = gsap.context(() => {
        callbackRef.current(context);
      }, scope);
    } else if (scope?.current) {
      // 如果 scope 是 ref 对象
      context = gsap.context(() => {
        callbackRef.current(context);
      }, scope.current);
    } else {
      // 没有 scope，直接执行
      context = gsap.context(() => {
        callbackRef.current(context);
      });
    }

    ctxRef.current = context;

    // 清理函数：组件卸载时清理所有动画和事件监听器
    return () => {
      if (context) {
        context.revert(); // 清理所有动画和 ScrollTrigger 实例
      }
      ctxRef.current = null;
    };
    // 注意：
    // 1. scope 如果是 ref 对象，其引用是稳定的，不应该作为依赖项（ref.current 变化不会触发重新渲染）
    // 2. scope 如果是字符串，应该作为依赖项
    // 3. dependencies 数组通过展开运算符包含，允许用户自定义依赖项
    // 4. 由于 dependencies 是动态的，我们使用 eslint-disable 来避免静态检查警告
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, typeof scope === 'string' ? scope : null, ...dependencies]);

  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, []);
}

/**
 * 导出 GSAP 实例，方便在组件中直接使用
 */
export { gsap };
