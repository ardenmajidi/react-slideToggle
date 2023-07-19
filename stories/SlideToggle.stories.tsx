import React from 'react';
import { Meta } from '@storybook/react';
import SlideToggle from '../src/SlideToggle';

const meta: Meta = {
    title: 'Slide Toggle',
    component: SlideToggle

}
export default meta;

export const Default = () =>

 <div style={{padding:`15px`,border:`1px solid #000`}}>
    <SlideToggle trigger={<button>click</button>} >        
        <div>
            <h1>Slide</h1>            
            <h2>dasd</h2>
            <p>jfdsklfjskldfj dfksdlkfjsadjfskldj</p>
        </div>
    </SlideToggle>
    </div>



export const Second = () =>

 <div style={{padding:`15px`,border:`1px solid #000`}}>
    <SlideToggle expanded={true} duration={1000} easing='easeInOutQuad' trigger={<h1>click</h1>} >        
        <div>
            <h1>Slide</h1>            
            <h2>dasd</h2>
            <p>jfdsklfjskldfj dfksdlkfjsadjfskldj</p>
        </div>
    </SlideToggle>
    </div>

export const Third = () =>

 <div style={{padding:`15px`,border:`1px solid #000`}}>
    <SlideToggle callBack={()=>{console.log('finish')}} duration={2000} easing='easeInOutQuint' trigger={<h1>click</h1>} >        
        <div>
            <h1>Slide</h1>            
            <h2>dasd</h2>
            <p>jfdsklfjskldfj dfksdlkfjsadjfskldj</p>
        </div>
    </SlideToggle>
    </div>
