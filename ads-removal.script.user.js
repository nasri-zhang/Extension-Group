// ==UserScript==
// @name         Inline Ads Removal
// @name:zh-CN   去广告+禁止新窗口打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove ads/iframes, and force links in current tab.
// @description:zh-CN 移除所有广告框架、修改所有链接在当前页打开
// @author       Assistant
// @match        *://*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. 移除内置广告与嵌入框架 (iframe)
    function removeAds() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.remove());

        const adSelectors = [
            '.ad', '.ads', '[class*="ad-"]', '[id*="ad-"]',
            'div[style*="position: fixed"]', 'div[style*="z-index: 9999"]'
        ];
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // 2. 移除 target="_blank"，强制所有链接在当前标签页打开
    function forceCurrentTab() {
        const links = document.querySelectorAll('a[target="_blank"]');
        links.forEach(link => {
            link.removeAttribute('target');
        });
    }

    // 页面加载完毕执行一次
    removeAds();
    forceCurrentTab();

    // 动态监听 DOM 变化（防止异步加载广告或新动态节点）
    const observer = new MutationObserver(() => {
        removeAds();
        forceCurrentTab();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
