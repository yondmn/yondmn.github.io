---
layout:     post
title:      "PWA 学习总结 二"
subtitle:   " \"Hello PWA, Reliable Fast Engaging\""
date:       2018-11-08
author:     "Yondmn"
header-img: "img/post-bg-pwa.png"
tags:
    - JS
---

# 缓存

1. **缓存取决于每次更新的缓存键**
每次发生内容变更都要更新`缓存键` (cacheName)，否则内容不会更新而是继续提供旧的内容。
2. **每次更新一丢丢内容都要重新下载全部内容**
哪怕是只修改了一个字节也会导致所有的缓存失败，然后重新下载所有缓存内容。
3. **要阻止浏览器缓存 ServiceWorker**
ServiceWorker 要使用 HTTPS 直接向服务器请求，而不能通过浏览器的缓存返回内容，如果 ServiceWorker 被缓存后续内容无法更新
4. **注意生成环境的缓存优先策略**
一般我们的项目都是使用 `缓存优先`的策略来部署服务器，这样的话对于  ServiceWorker 的部署就是一个挑战了，因为一旦浏览器缓存了 ServiceWorker 的副本日后更新起来就极其困难。

**注意**
* ServiceWorker 取消注册后，它可能仍位于列表内，直到包含它的浏览器窗口重新打开。
* 如果有多少包含该 ServiceWorker 的窗口处于打开状态，那么新的 ServiceWorker 会等到这些所有的窗口都重新加载并更新到了最新的 ServiceWorker 后才会生效。
* ServiceWorker 取消注册后不会清除缓存，如果不修改 CacheName (缓存名称) 那么取到的数据可能还是旧的。
* 在已有 ServiceWorker 的基础上注册新的 ServiceWorker ，新的 ServiceWorker 会在页面重新加载后才能获取控制权。（Google 大佬有这么个直接获取控制权的东西 [GoogleChrome/samples](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/immediate-control)。


**Solution**

Google 大佬的 [sw-precahe](https://github.com/GoogleChromeLabs/sw-precache) , 能对过期内容精细控制

同样也可以使用 Google 开发的一个辅助库 `Workbox` ，能够处理常见的缓存策略，详见[官网](https://developers.google.cn/web/tools/workbox/)



