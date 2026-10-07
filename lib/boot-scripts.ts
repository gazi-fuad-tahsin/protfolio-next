/**
 * Tiny inline scripts for <head> that run before first paint, so the saved
 * theme and language are applied without a flash. Kept in a plain module:
 * a constant exported from a "use client" file reaches the server only as a
 * client reference, not as the string itself.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}})();`;

export const langScript = `(function(){try{var l=localStorage.getItem('lang');if(l==='bn'){document.documentElement.dataset.lang='bn';document.documentElement.lang='bn';}}catch(e){}})();`;
