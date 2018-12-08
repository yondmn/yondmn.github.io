---
layout:     post
title:      "Jenkins 折腾记"
subtitle:   " \"Hello Jenkins, build anything\""
date:       2018-12-08
author:     "Yondmn"
header-img: "img/post-bg-jenkins.png"
tags:
    - Jenkins
---

# Jenkins 折腾记


公司使用了也挺长一段时间 “傻瓜式” 的一条龙服务发布构建打包系统，对其一系列流程有些好奇，遂下决心一定要弄个明白，作为一个有志青年总不能啥事都稀里糊涂的做了呀哈哈哈哈🤣🤣🤣🤣🤣🤣🤣🤣。

整套流程从 `项目创建` 到 `构建打包` 要经过一系列自动化处理，所以我先从最后一步 `构建打包` 这一阶段开始研究，也就是本文主题 **[Jenkins](https://jenkins.io/)**。 🙈

OK, let's face it.

## 搭建环境

- 系统：Centos 6.9
- Jenkins: 2.150.1

## 前置条件

1. 由于 Jenkins 是 Java 语言开发的，所有要先装个 Java JDK。

```shell
    yum install -y java
```
    
2. 安装 Jenkins
 
```shell
    wget http://pkg.jenkins-ci.org/redhat-stable/jenkins-2.7.3-1.1.noarch.rpm
    rpm -ivh jenkins-2.7.3-1.1.noarch.rpm
```

**提示**
这里安装的是一个 2.7.3-1.1 版本的，我用这个版本出现了很多问题，后面会给出解决方案。

3. 配置 Jenkins 端口

默认安装的配置文件就是 `/etc/sysconfig/jenkins` 这个。里面有个配置参数叫 `JENKINS_PORT="8080" ，Jenkins 默认的端口也就是 8080 。

```shell
    vi /etc/sysconfig/jenkins
```

4. 启动 Jenkins

```shell
    # 先找到 Jeknins 的位置
    whereis jenkins     #jenkins: /usr/lib/jenkins
    # 使用 Java 启动 Jenkins
    java -jar jenkins.war
```
    
以上就完成使用 Jenkins 之前的所有安装操作，没有问题的话就可以通过服务器地址或者域名进行使用 Jenkins 了🎉🎉🎉🎉🎉🎉🎉。

## 使用 Jenkins 创建任务

我是使用自己随便测试用的 react 项目来进行 Jenkins 构建测试，我把这个项目传到了 github 上面，
就是一个超级普通的 react 项目，地址是 [jenkins-test](https://github.com/yondmn/jenkins-test)

首先看一下 Jenkins 首页面板是这个样子

![Jenkins dashboard](/img/in-post/2018-12-08-jenkins-toss/1544277445736.jpg)

然后选择 `new 任务`，创建一个构建项目，进入到下面这样的一个界面，给任务起一个响亮的名字，然后再选择 `构建一个自由风格的软件项目`。

![new task](/img/in-post/2018-12-08-jenkins-toss/1544277629731.jpg)

创建好构建项目后，就直接进入到了该任务的配置页面，如下图：

![configure page](/img/in-post/2018-12-08-jenkins-toss/1544277751102.jpg)

因为本测试用例是 Github 上的项目，所有在配置页面上勾选上了 `github 项目` 和 `Git` 两个选项。然后再巴拉巴拉写一点 `Discription`，填好 Github 的项目 `项目 URL` ，再填写下面 Git 的 `Repository URL` 仓库地址，如下：

![configure](/img/in-post/2018-12-08-jenkins-toss/1544277861720.jpg)

**敲黑板啦**

上面截图中可以发现特意留了一处错误，造成上面的错误一共有两个原因

- 1. Jenkins 服务器上没有安装 Git
- 2. 即使安装好了 Git ，但是没有配置好 Git 可执行程序的路径

因为 Jenkins 要在服务器上使用 Git 命令来下载或者克隆 Github 服务器上的代码到服务器上构建，所有要在 Jenkins 安装的服务器上要安装 Git。

**Solution**

1. 第一种问题就到 Jenkins 安装的服务器上把 Git 给安装上就好了，也就是执行一下 `yum install git` 。
2. 第二个就在 `Jenkins` -> `系统管理` -> `全局工具配置` 页面里面的 `	Path to Git executable` 的 Git 执行路径填一下像下面这样

![Path to Git executable](/img/in-post/2018-12-08-jenkins-toss/1544278998918.jpg)

**至此**

第一个任务已经可以进行构建了，在首页点进去任务名称比如我的叫 react ，进入下面的页面然后点击左侧的立即构建就可以进行构建任务了。

![build task](/img/in-post/2018-12-08-jenkins-toss/1544279397600.jpg)

⬆️ 每次构建都在左下方 `build history` 生成一个构建历史。红色表示构建失败，蓝色表示构建成功。

最开始我构建出现了很多的构建失败任务，Google 了一大堆也没解决。比如像下面这样的错误

![build failed](/img/in-post/2018-12-08-jenkins-toss/1544279472218.jpg)

搞了半天也没解决，然后在 Jenkins 选择 `系统设置` 的时候发现能直接升级 Jenkins 。然后选择升级，等了一会 Jenkins 升级成功再构建则成功了👹。。。。

然后就可以在任务 react 的配置页中继续添加要构建的具体任务

![-w979](/img/in-post/2018-12-08-jenkins-toss/1544282913421.jpg)

随便添加了两行命令，还可以执行具体是 shell 脚本进行为所欲为啦哈哈

## 总结

Jenkins 用来做自动化构建任务还是很方便的，一切配置好之后真的可以为所欲为，比如打包、发布上线等等。



