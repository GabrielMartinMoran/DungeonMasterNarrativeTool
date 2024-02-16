import { MAX_MOBILE_WIDTH } from '../config';

export const isMobileSize = () => {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width <= MAX_MOBILE_WIDTH;
};
