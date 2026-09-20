import { ReactNode, ElementType, CSSProperties } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  yOffset?: number; // in pixels
  threshold?: number;
  rootMargin?: string;
  as?: ElementType;
  id?: string;
  style?: CSSProperties;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 650,
  yOffset = 28,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  as: Tag = 'div',
  id,
  style = {},
}: RevealProps) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  return (
    <Tag
      id={id}
      ref={ref}
      className={`${className} transition-all`}
      style={{
        ...style,
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateY(0px)' : `translateY(${yOffset}px)`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
