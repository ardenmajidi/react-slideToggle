import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  trigger: React.ReactNode;
  easing?: 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeLinear';
  duration?: number;
  collapsed?: boolean;
  callBack?: () => void;
}

const easingFunctions: { [key: string]: (t: number, b: number, c: number, d: number) => number } = {
  easeLinear: (t, b, c, d) => c * t / d + b,
  easeInQuad: (t, b, c, d) => c * (t /= d) * t + b,
  easeOutQuad: (t, b, c, d) => -c * (t /= d) * (t - 2) + b,
  easeInOutQuad: (t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b,
};

const SlideToggle: React.FC<Props> = ({ children, trigger, easing = 'easeInOutQuad', duration = 600, collapsed = true, callBack }) => {
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const refElement = useRef<HTMLDivElement>(null);
  const totalHeightRef = useRef<number>(0);

  const handleAnimation = useCallback((time: number) => {
    if (!refElement.current) return;

    const progress = Math.min(1, time / duration);
    const trn = easingFunctions[easing](progress, 0, totalHeightRef.current, 1);

    if (!collapsed) {
      refElement.current.style.height = `${totalHeightRef.current - trn}px`;
    } else {
      refElement.current.style.height = `${trn}px`;
    }

    if (progress < 1) {
      requestAnimationFrame(handleAnimation);
    } else {
      setIsSliding(false);
      if (callBack) callBack();
    }
  }, [easing, duration, collapsed, callBack]);

  const slideElement = () => {
    if (isSliding) return;
    setIsSliding(true);

    if (!collapsed) {
      totalHeightRef.current = getTotalHeightWithMargins(refElement.current);
    } else {
      totalHeightRef.current = 0;
      Array.from(refElement.current?.childNodes || []).forEach((c) => {
        if (c instanceof HTMLElement) {
          totalHeightRef.current += getTotalHeightWithMargins(c);
        }
      });
    }

    requestAnimationFrame((time) => {
      handleAnimation(time);
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup: Cancel any pending animation frames when the component unmounts.
      if (isSliding) {
        setIsSliding(false);
      }
    };
  }, [isSliding]);

  useEffect(() => {
    if (!refElement.current) return;

    // Set initial styles for the element on mount.
    if (!collapsed) {
      refElement.current.style.height = 'auto';
      refElement.current.style.overflow = 'hidden';
    } else {
      refElement.current.style.height = '0';
      refElement.current.style.overflow = 'hidden';
    }

    // Trigger animation on initial mount if not collapsed.
    if (!collapsed) {
      requestAnimationFrame((time) => {
        handleAnimation(time);
      });
    }
  }, [collapsed, handleAnimation]);

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement, { onClick: slideElement })}
      <div ref={refElement} style={{ overflow: 'hidden', transition: `height ${duration}ms ${easing}` }}>
        <div className='wrapper' style={{ overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default SlideToggle;

function getTotalHeightWithMargins(element: HTMLElement) {
  const computedStyle = getComputedStyle(element);
  const height = parseFloat(computedStyle.height);
  const marginTop = parseFloat(computedStyle.marginTop);
  const marginBottom = parseFloat(computedStyle.marginBottom);
  return height + marginTop + marginBottom;
}
