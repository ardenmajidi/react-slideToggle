import React, { useRef, useState, useEffect, useCallback } from 'react'
interface Props {
    children: React.ReactNode;
    trigger: React.ReactNode;
    easing?:'easeInCubic'| 'easeOutCubic'|'easeInOutCubic'|'easeInQuart'|'easeOutQuart'|'easeOutQuart'|'easeInOutQuart'|'easeInQuint'|'easeOutQuint'|'easeInOutQuint'|'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeLinear';
    duration?: number;
    expanded?: boolean;
    callBack?: () => void;
   
}
const defaults = {
    duration: 700,  
    expanded: false,

}
const easingFunctions: { [key: string]: (t: number, b: number, c: number, d: number) => number } = {
  easeLinear: (t, b, c, d) => c * t / d + b,
  easeInQuad: (t, b, c, d) => c * (t /= d) * t + b,
  easeOutQuad: (t, b, c, d) => -c * (t /= d) * (t - 2) + b,
  easeInOutQuad: (t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b,
  easeInCubic: (t, b, c, d) => c * (t /= d) * t * t + b,
  easeOutCubic: (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b,
  easeInOutCubic: (t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b,
  easeInQuart: (t, b, c, d) => c * (t /= d) * t * t * t + b,
  easeOutQuart: (t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b,
  easeInOutQuart: (t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b,
  easeInQuint: (t, b, c, d) => c * (t /= d) * t * t * t * t + b,
  easeOutQuint: (t, b, c, d) => c * ((t = t / d - 1) * t * t * t * t + 1) + b,
  easeInOutQuint: (t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b,
};

const SlideToggle = ({ ...props }: Props) => {
    const [expanded, setexpanded] = useState<boolean>(props.expanded ? props.expanded : defaults.expanded)
    const duration = props.duration ? props.duration : defaults.duration
    const mainRef = useRef({
        ...defaults, ...props,
        requestRef: 0,
        previousTimeRef: 0,
        height: 0,
        isSliding: false
    })

    const refElement = useRef<HTMLDivElement>(null);
    const easingFn = easingFunctions[props.easing ? props.easing:'easeLinear']  
    const handleAnimation = useCallback((time: number) => {
        if (!refElement.current) return    
        mainRef.current.requestRef = time - mainRef.current.previousTimeRef;
        const trn = easingFn(mainRef.current.requestRef, 0, mainRef.current.height, duration);    
        if (expanded)
        refElement.current.style.height = `${(mainRef.current.height - trn).toFixed(2)}px`        
        else      
            refElement.current.style.height = `${trn.toFixed(2)}px`        
      
        if (mainRef.current.requestRef < duration) {
            requestAnimationFrame(handleAnimation);
        } else {
            if (expanded)
                refElement.current.style.height = `0px`
            else
                refElement.current.style.height = `auto`

            mainRef.current.isSliding = false;
            if (props.callBack)
                props.callBack()
            setexpanded(expanded => !expanded);
        }

    },[expanded])

    const slideElement = () => {
        if (mainRef.current.isSliding) return
        mainRef.current.isSliding = true
      
        if (expanded) {
            mainRef.current.height = getTotalHeightWithMargins(refElement.current)
       
        }
        else {
            if (!refElement.current)
                return          
            mainRef.current.height = 0;
            Array.from(refElement.current.childNodes || []).forEach((c) => {
                if (c instanceof HTMLElement) {               
                    mainRef.current.height += getTotalHeightWithMargins(c); 
                         
                }
            });

        }
        requestAnimationFrame((time) => {
            mainRef.current.previousTimeRef = time;
            handleAnimation(time);
        });

    }
    useEffect(() => {     
        
        if (!refElement.current) return
        if (expanded) {
            refElement.current.style.height = `auto`;
            refElement.current.style.overflow = `hidden`;

        }
        else {
            refElement.current.style.height = `0`;
            refElement.current.style.overflow = `hidden`;
        }

    }, [])

    return (
        <div className={expanded?'active slide-toggle':'slide-toggle'}>
            {React.cloneElement(props.trigger as React.ReactElement, { onClick: slideElement })}
            <div ref={refElement}>
                <div className='wrapper' style={{overflow:'auto'}}>
                {props.children}
                </div>
            </div>
        </div>
    );
}

export default SlideToggle;

function getTotalHeightWithMargins(element: any) {
    const computedStyle = getComputedStyle(element);
    const height = parseFloat(computedStyle.height);
    const marginTop = parseFloat(computedStyle.marginTop);
    const marginBottom = parseFloat(computedStyle.marginBottom);
    return height + marginTop + marginBottom;
}

