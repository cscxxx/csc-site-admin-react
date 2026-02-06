import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP, gsap } from '@/hooks/useGSAP';
import styles from './RouteTransition.module.less';

interface RouteTransitionProps {
  children: React.ReactNode;
}

/**
 * 路由过渡动画组件
 * 在路由切换时提供淡入淡出动画效果
 */
function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        // 淡入动画
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          }
        );
      }
    },
    {
      scope: containerRef,
      dependencies: [location.pathname],
    }
  );

  return (
    <div ref={containerRef} className={styles.routeTransition}>
      {children}
    </div>
  );
}

export default RouteTransition;
