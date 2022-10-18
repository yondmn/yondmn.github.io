---
layout:     post
title:      "PWA 学习总结 一"
subtitle:   " \"Hello PWA, Reliable Fast Engaging\""
date:       2018-10-26 12:00:00
author:     "Yondmn"
header-img: "img/post-bg-pwa.png"
tags:
    - JS
---

> 已经开始了 PWA 的相关知识系统化学习，每学习到一个阶段都在这里做一个总结，帮助自己更好的总结吸收知识。

## 一、简介
[Google PWA](https://developers.google.com/web/progressive-web-apps/) 介绍
Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。
主要有以下三个特点：
- Reliable：可靠，即使弱网环境甚至离线状态也能瞬时加载
- Fast：响应快速，平滑响应用户操作
- Engaging：粘性的，可以将网站添加到桌面，让用户有着原生应用的体验

可以说 PWA 是介于 Web App 和 Native App 之间的一项新技术吧

## 二、运行环境

我是使用 Webpack 来简单配置了一个脚手架启动 Web 服务，在这里就不赘述与 PWA 不太相关的过程了，直接进入 PWA 部分。
整体目录结构很简单

![目录结构](http://ph6ucc5kk.bkt.clouddn.com/a92c83fd0e1eec978f896da92406e9c3.jpg)

## 三、如何工作

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

上面的代码中是 serviceWroker 生命周期的第一个阶段，即 install 事件，这个阶段是把后面页面需要频繁使用的资源进行缓存的最佳阶段。cachesName 是用来设置缓存的名称，每个 cachesNmae 都对应唯一的缓存，这在 serviceWorker 的后面的阶段比如 `清除缓存` 是很方便的。一旦缓存开启，就通过 cache.addAll 来把缓存数组内的所有文件进行缓存，但是如果这些文件中有任何一个资源缓存失败，那么也就导致 serviceWorker 的安装也失败了，所以合理的控制好缓存资源的多少也是很重要的。

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

上图中可看到当刷新页面时 127.0.0.1 和 index.js 的 size 都是 from `ServiceWorker` ，也就是来自 `ServiceWorker` 的缓存。

## 生命周期

> 从上面了解了 PWA 的基本操作步骤之后需要知道 ServiceWorker 的生命周期，这对彻底理解 PWA 的工作原理很重要

这里有一张 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker) 的详细的生命周期图：

![ServiceWorker lifecycle](/img/in-post/pwa-learning/sw-lifecycle.png)

由上图可以看到 `ServiceWorker` 的生命周期有 5 个阶段：`安装中`、`安装后`、`激活中`、`激活后`、`被废弃`

- instanlling: 这个状态在 ServiceWorker 注册之后就开始进行安装，由上图可知也是在这个阶段来触发 `install` 的事件回调的，然后在回调中做一些静态资源的缓存啊一些操作，处理完毕也就到了下一个阶段 `installed` 阶段。
- installed: ServiceWorker 已经完成了安装，等待客户端使用的其他 ServiceWorker 被关闭。
- activating: 这个阶段没有被其他 ServiceWorker 控制的客户端，允许当前的 ServiceWorker 完成安装或者清理其他的 ServiceWorker 关联的旧缓存资源，也是在这个阶段触发了 `activate` 事件。
- activated: 在这个阶段处理 activated 回调的一些功能事件。
- redundant: 当前 ServiceWorker 被其他代替，生命周期结束。


**注意**

1. 新开的浏览器标签页打开 PWA 页面，会依次进行 `注册成功`、`install` 事件触发、`activate` 事件触发阶段，此时再次 (不管几次) 刷新浏览器都只会有 `注册成功`，不会再进入 intall 和 activate 事件。在调试工具的 `Application` 中的 `Service Worker` 的 Status 也会变成 **acticated and is running** 。
2. 在不关闭标签页的时候刷新 PWA 页面，可以看到调试工具的 `Application` 中的 `Service Worker` 的 Status 多加了一行 **waiting to activate**。说明有新版本的 ServiceWorker 可以更新，可以点击旁边的 `skipWaiting` 进行跳过，在开发阶段我们可以在 install 事件的回调中加入一行 **self.skipWaiting()** 来进行跳过。
3. 在线上环境可以不能使用 `self.skipWaiting()` 来进行跳过操作，那么只有在关闭标签页重新打开一个新的标签页时才会更新进入  **acticated and is running** 阶段。
4. 在调试的时候发现如果 ServiceWorker 中的代码有错误的话是无法通过 try catch 来进行捕获的，只能看到调试器中的 `Source sw.js` 的右边有一个错误数量 <span style="color:red">10</span> 的显示，然后又点不进去定位错误，不知道是不是我的打开方式不对。。。


## 总结

本片文章就是做个入门的了解，在进行其他更多功能之前先弄清楚基本的操作以及非常重要的生命周期。清楚生命周期之后在之后的调试过程中才不会出现摸不清头脑无法定位问题的情况。

一定要记住 ServiceWorker 的五个生命周期以及他们的作用和触发事件，以及更新机制。


> 目前文章里面的图片是[七牛云](qiniu.com)的测试域名使用不了了，需要配置一个自己的已备案域名，等备案成功后再重新修改图片 URL。