---
layout:     post
title:      "Web Components"
subtitle:   " \"自定义元素，可重用组件\""
date:       2019-01-15
author:     "Yondmn"
header-img: "img/post-bg-web-components.png"
tags:
    - JS
    - Web Components
---


> 现在越来越多的框架都基于 Web Components 的技术来实现代码重用，再次做了一篇总结

## 概念

Web Components 是由 4 项主要技术组成，可以一起使用来封装组件

- Custom Elements: 使用 JS API 来按照用户界面需求来定制元素
- Shadow DOM: 使用 JS API 可以将 Shadow DOM 附加到元素上并与其做某种关联，与主 DOM 分开呈现
- HTML templates: 使用 Vue 的感觉就是跟 Vue 的 template 一样的功能
- HTML Imports: 使用 `<link rle="import" href="xxx.html">` 来导入 HTML 片段

## 方法

实现 Web Components 通常就是如下几个步骤

1. 使用 ES6 类的语法创建一个类，可继承自 `HTMLElement` 、`HTMLParagraphElement` 等类
2. 使用 `CustomElementRegistry.difine()` 方法注册新定义的元素，向其传递要定义的元素名称、元素功能等
3. 如果有需要，使用 `Element.attachShadow()` 方法将一个 Shadow DOM 附加到自定义的元素上，并可以使用 DOM 方法像 Shadow DOM 中添加子元素、事件等
4. 如果有需要，使用 `<template>` 和 `<slot>` 元素定义一个 HTML 模板，再使用常规 DOM 方法将其附加到 Shadow DOM 中
5. 在页面的任何位置使用自定义元素

先来个小 🌰 看一下哈

> 定义一个继承自 HTMLParagraphElement 的 TestCom 类

```javascript
class TestCom extends HTMLParagraphElement {
    constructor() {
        super();
    }

    // 一些功能啥的写在这, 比如一些生命周期的钩子函数
}
```

> 再定义一个 element , 如下

```javascript
customElements.define('test-com', TestCom, { extends: 'p' });
```

把 TestCom 类定义成了一个扩展自 p 元素的自定义元素 test-com , 上面那样就完成了一个自定义 test-com 元素

自定义元素一共有两种

- 自定义新元素：不继承自标准元素，像这样的 `<test-com></test-com>` 或者 `document.createElement('test-com')`
- 扩展元素：自定义了内置元素，继承自基础元素，需要通过基础元素使用 `is` 属性来进行指定，比如 `<p is="test-com">` 或者 document.createElement('p', { is: 'test-com' })



### 自定义新元素

> 自定义元素与其他任何元素的使用没有区别，都是可以添加监听事件，获取 DOM 啊等等。下面示例自定义新元素相当于扩展了 HTMLElement，所以他就完整的继承了 DOM API。

代码如下：

```javascript
class TestComponent extends HTMLElement {
    constructor() {
        super();

        // mode: open 通过 element.shadowRoot 访问返回一个 ShadowRoot Obj , closed 访问返回为 null
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        
        const img = document.createElement('img');
        img.classList.add('img');
        
        const span = document.createElement('span');
        span.classList.add('title');

        if (this.hasAttribute('img')) img.src = this.getAttribute('img');

        if (this.hasAttribute('title')) span.textContent = this.getAttribute('title');

        const style = document.createElement('style');
        style.textContent = `
            .wrapper {
                display: flex;
                flex-direction: column;
                width: 100px;
                height: 120px;
            }
            .wrapper .img {
                width: 100%;
                height: 100px;
            }
            .wrapper .title {
                line-height: 20px;
                text-align: center;
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(img);
        wrapper.appendChild(span);
    }
}

// 通过 customElements.define() 就定义了一个能直接在 HTML 文档中使用的元素了
customElements.define('test-com', TestComponent);
```

上面构造函数中写的一些操作基本上都是一些 Javascript 操作 DOM 的方法，所以实现起来还是很简单的，代码中注释的 mode 字段的意思和区别看一下下面具体的两个图就可以明白了

**mode: open**

![](http://assets.ym250.cn/9bc7125681016ce7e0934f5c481b8d69.jpg)


**mode: closed**

![](http://assets.ym250.cn/829fe95597adc48ee1e774413c63df85.jpg)



**注意**

1. 自定义元素标签名称必须包含中划线 (-)。
2. 不能多次注册同一标记。
3. 自定义元素不能自我封闭，必须写封闭标签（<test-com></test-com>）


### 扩展元素

> 简单来说，扩展元素就是让 Shadow DOM 附着在原始元素上并对其进行扩展而已。并不是所有元素都可以附着 Shadow DOM 的，比如由于安全原因 `<a>` 就不能 attach Shadow DOM，不但可以扩展内置 HTML, 也可用于扩展其他自定义元素。

以下元素可以附着 Shadow DOM:

> `<article> <aside> <backquote> <body> <div> <footer>`
> `<h1> <h2> <h3> <h4> <h5> <h6>`
> `<header> <main> <nav> <p> <section> <span>`

写了个例子，代码如下：

```javascript
class ExpandButton extends HTMLButtonElement {
    constructor() {
        super();
        window.onload = () => {
            // 从这里可以看出本例子的操作姿势是和上面的自定义新元素有些不同，但是在本例中也是可以使用
            // this 来访问扩展元的的 DOM 的。
            const buttons = Array.from(document.querySelectorAll('button'));
            buttons.forEach(button => {
                button.style = `
                    width: 100px;
                    line-height: 30px;
                    padding: 0;
                    background: #ff571a;
                    font-size: 24px;
                    color: aqua;
                    outline: 0;
                `;
                button.addEventListener('click', (e) => {
                    console.log(e.target.innerHTML);
                }, false);
            });
        };
    }
}

customElements.define('expand-button', ExpandButton, { extends: 'button' });
```

在使用方式上也是有两种方式来使用扩展元素，可以在原生标签上加上 `is=" "` 属性来声明:

    <button is="expand-button">确定</button>

另一种使用 JS 来创建实例:

    let button = document.createElement('button', {is: 'expand-button'});
    button.textContent = '确定';
    document.body.appendChild(button);

或者使用 `new` 运算符:

    let button = new ExpandButton();
    button.textContent = '确定';
    document.body.appendChild(button);

在使用方式上可以看一下与自定义新元素的对比：

![](http://assets.ym250.cn/f92d7fa545f13bbf130ecc531791169a.jpg)

在这个例子中是对 `<button>` 元素进行了扩展，可以看到 button 元素是没有 Shadow DOM 的，因为 `<button>` 不在上面说的列表中。而且使用方式也和 [自定义新元素](#自定义新元素) 不同，是在元素上使用 is 属性来指定的，直接使用扩展元素名称作为标签是无效的。



## 生命周期

> Web Components 生命周期有 4 个钩子函数

- connectedCallback: 当元素首次被插入到 DOM 被调用。
- disconnectedCallback: 当元素从 DOM 中被删除 (remove) 被调用。
- adoptedCallback: 当元素被移动到新文档时被调用, 例如 document.adoptNode(element) 。
- attributeChangedCallback: 当元素增删改自身属性时被调用。回调参数（属性名，旧的值，新的值）, 只作用于 `observedAttributes` 列出的数组元素起作用

代码如下:

```javascript
class TestCom extends HTMLElement {
    static get observedAttributed() {
        return ['disabled', 'open'];
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(val) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    // 只有改变元素的 disabled 和 open 属性才能出发该回调
    attributeChangeCallback(name, oldVal, newVal) {

    }
}
```

## 总结

自定义元素让开发者可以在浏览器中定义新的 HTML 元素并可重用的 “组件”。`Web Components` 还远不止本文章所写内容，它也一样可以像在 `Vue` 中使用 `<template>` 来使用 “组件”。在使用上 `Web Components` 也没有说引入什么新技术，完全是使用原生 Js、CSS、HTML 无需借助任何库来进行创造。
