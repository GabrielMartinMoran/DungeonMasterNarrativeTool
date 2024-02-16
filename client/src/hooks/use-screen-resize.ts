import { useLayoutEffect, useState } from 'react';
import { isMobileSize } from '../utils/screen';

export const useScreenResize = () => {
    const [size, setSize] = useState([0, 0]);
    const [isMobile, setIsMobile] = useState(isMobileSize());
    useLayoutEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
            setIsMobile(isMobileSize());
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return {
        width: size[0],
        height: size[1],
        isMobile,
    };
};
