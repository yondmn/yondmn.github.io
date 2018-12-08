---
layout:     post
title:      "PWA 学习总结 三"
subtitle:   " \"Hello PWA, Reliable Fast Engaging\""
date:       2018-11-14
author:     "Yondmn"
header-img: "img/pwa-hero.jpg"
tags:
    - JS
    - PWA
    - notes
---

# 拦截请求

## 介绍 🤓

`ServiceWorker` 可以拦截浏览器发出的任何 HTTP 请求，属于此 `ServiceWorker` 作用域下的每个 HTTP 请求都将触发 `ServiceWorker` 内部监听的 `fetch` 事件，例如页面加载的 HTML、JavaScript、CSS、图片等等。

