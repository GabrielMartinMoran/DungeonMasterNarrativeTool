export const WEB_API_URL =
    window.location.origin.indexOf('localhost') !== -1 ? 'http://localhost:5000/api' : `${window.location.origin}/api`;

export const DICE_PARSING_REGEX = /(?:(?:(?<=[ \n\>])\d+[dD]\d+)(?: *\+ *(?:(?:\d+[dD]\d+)|(?:\d+)))*)/g;

export const DND_5E_TOOLS_URL = 'https://5e.tools';

export const DND_5E_TOOLS_URL_DEFAULT_SOURCE = 'phb';

export const DND_5E_TOOLS_PATHS: any = {
    conditions: '/conditionsdiseases.html#',
    spells: '/spells.html#',
    items: '/items.html#',
};

export const MAX_MOBILE_WIDTH = 800;
