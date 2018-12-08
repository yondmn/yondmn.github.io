---
layout:     post
title:      "PWA 学习总结 一"
subtitle:   " \"Hello PWA, Reliable Fast Engaging\""
date:       2018-10-26 12:00:00
author:     "Yondmn"
header-img: "img/post-bg-pwa.png"
tags:
    - JS
    - PWA
    - notes
---

已经开始了 PWA 的相关知识系统化学习，每学习到一个阶段都在这里做一个总结，帮助自己更好的总结吸收知识。

# 一、简介
[Google PWA](https://developers.google.com/web/progressive-web-apps/) 介绍
Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。
主要有以下三个特点：
- Reliable：可靠，即使弱网环境甚至离线状态也能瞬时加载
- Fast：响应快速，平滑响应用户操作
- Engaging：粘性的，可以将网站添加到桌面，让用户有着原生应用的体验

可以说 PWA 是介于 Web App 和 Native App 之间的一项新技术吧

# 二、运行环境

我是使用 Webpack 来简单配置了一个脚手架启动 Web 服务，在这里就不赘述与 PWA 不太相关的过程了，直接进入 PWA 部分。
整体目录结构很简单

![目录结构](http://ph6ucc5kk.bkt.clouddn.com/a92c83fd0e1eec978f896da92406e9c3.jpg)

# 三、具体实现

`index.js`

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(registration => {
        console.log('register success ', registration.scope)
    })
    .catch(err => {
        console.log('register failed ', err)
    })
}
```

首先要判断 `serviceWroker` 是否是 `navigator` 的属性，如果存在才表示该浏览器支持 servieWorker, 然后就是使用
`navigator.serviceWorker.register` 进行注册 serviceWorker 使用的 js 文件。可以看出该方法是基于 promise 的，所以可以
通过 then 和 catch 来判断是否注册成功.


`sw.js`

```javascript
// 用来保存缓存的名称
const cachesName = 'HiPWA'

// 需要被缓存的列表
const cacheList = [
    './bundle.js',
    './index.css'
]
// 监听 serviceWroker 的 install 事件
self.addEventListener('install', e => {
    e.waitUntil(caches.open(cachesName)
        .then(cache => {
            cache.addAll[cacheList]
        })
    )
})
```

上面的代码中是 serviceWroker 生命周期的第一个阶段，即 install 事件，这个阶段是把后面页面需要频繁使用的资源进行缓存的最佳阶段。cachesName 是用来设置缓存的名称，每个 cachesNmae 都对应唯一的缓存，这在 serviceWorker 的后面的阶段比如`清除缓存`是很方便的。一旦缓存开启，就通过 cache.addAll 来把缓存数组内的所有文件进行缓存，但是如果这些文件中有任何一个资源缓存失败，那么也就导致 serviceWorker 的安装也失败了，所以合理的控制好缓存资源的多少也是很重要的。

如果以上步骤成功会在 Chrome DevTools 中的 Application 中 Cache Storage 看到这样的内容。

![Cache Storage](http://ph6ucc5kk.bkt.clouddn.com/16b1af33538b7e7da83649ad529a19be.jpg)

可以看到要缓存的 bundle.js 文件已经出现在已缓存列表内了



-------------------

缓存已经准备好了，可以获取到已经缓存的资源了，然后看下一个 fetch 事件阶段

```javascript
self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request)
        .then(response => {
            if (response) {
                return response
            }

            return fetch(e.request)
        })
    )
})
```

上面代码是在 `ServiceWorker` 中添加了 `fetch` 事件的监听，通过 `caches.match` 方法来检查传入的 URL 是否匹配当前缓存中存在的任何内容。 `then` 回调中的 `response` 如果存在内容则表示请求的内容在缓存的列表中那么直接返回缓存内容，否则重新调用 `fetch` 方法通过网络请求。

**注意** 
`ServiceWorker` 只能通过 **HTTPS** 协议来使用，这是因为 `ServiceWorker` 的权限太大了，它能拦截页面中的所有请求并任意改变响应内容。

![index from serviceWorker](http://ph6ucc5kk.bkt.clouddn.com/f91a033843ea32747a4a08537ea54459.jpg)

上图中可看到当刷新页面时 127.0.0.1 和 index.js 的 size 都是 `from ServiceWorker` ，也就是来自 `ServiceWorker` 的缓存。

