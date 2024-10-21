import { inBrowser } from 'vitepress';

const SITE = '3d22d14b100ebeac51fd547b478cd26a';

declare global {
  interface Window {
    _hmt: any;
  }
}

function registerAnalytics() {
  window._hmt = window._hmt || [];
  const script = document.createElement('script');
  script.innerHTML = `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${SITE}";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })()`;
  document.querySelector('head')?.append(script);
}

export function baiduPlugin() {
  // @ts-ignore
  if (inBrowser && import.meta.env.PROD) {
    registerAnalytics();
  }
}