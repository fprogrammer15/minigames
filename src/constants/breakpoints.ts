// Same values as $breakpoint-tablet and $breakpoint-mobile-layout in _tokens.scss
export const BREAKPOINT_TABLET = 768;
export const BREAKPOINT_MOBILE_LAYOUT = 600;

export const DESKTOP_MEDIA_QUERY = `(min-width: ${String(BREAKPOINT_TABLET + 1)}px)`;
export const MOBILE_MEDIA_QUERY = `(max-width: ${String(BREAKPOINT_MOBILE_LAYOUT)}px)`;
