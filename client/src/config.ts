export const WEB_API_URL =
    window.location.origin.indexOf('localhost') !== -1 ? 'http://localhost:5000/api' : `${window.location.origin}/api`;

export const DICE_PARSING_REGEX = /(?:(?:(?<=[ \n\>])\d+[dD]\d+)(?: *\+ *(?:(?:\d+[dD]\d+)|(?:\d+)))*)/g;
