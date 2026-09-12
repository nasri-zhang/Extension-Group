// ==UserScript==
// @name         汉字繁简转换 (OpenCC版)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  使用 OpenCC 实现网页繁体字到简体字的精准转换
// @author       nasri-zhang
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 初始化 OpenCC 转换器
    // from: 'hk' (香港繁体) 或 'tw' (台湾繁体) 或 't' (通用繁体)
    // to: 'cn' (大陆简体) 或 's' (通用简体)
    const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });

    // 2. 遍历并替换文本节点
    function convertNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 跳过 script 和 style 标签中的内容
            const parentTagName = node.parentElement ? node.parentElement.tagName.toLowerCase() : '';
            if (parentTagName === 'script' || parentTagName === 'style' || parentTagName === 'textarea') {
                return;
            }
            if (node.nodeValue && node.nodeValue.trim() !== '') {
                node.nodeValue = converter(node.nodeValue);
            }
        } else {
            for (let child of node.childNodes) {
                convertNode(child);
            }
        }
    }

    // 3. 转换页面已有内容
    function convertPage() {
        convertNode(document.body);
    }

    // 4. 监听 DOM 变化（处理动态加载的内容）
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
                convertNode(addedNode);
            }
        }
    });

    // 执行转换并开启监听
    if (document.body) {
        convertPage();
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            convertPage();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();
