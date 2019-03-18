# 理解Oauth2.0

> 为了理解OAuth的适用场合，让我举一个假设的例子。

> 有一个"云冲印"的网站，可以将用户储存在Google的照片，冲印出来。用户为了使用该服务，必须让"云冲印"读取自己储存在Google上的照片。
> 问题是只有得到用户的授权，Google才会同意"云冲印"读取这些照片。那么，"云冲印"怎样获得用户的授权呢？

> 传统方法是，用户将自己的Google用户名和密码，告诉"云冲印"，后者就可以读取用户的照片了。这样的做法有以下几个严重的缺点。

    1. "云冲印"为了后续的服务，会保存用户的密码，这样很不安全。

    2. Google不得不部署密码登录，而我们知道，单纯的密码登录并不安全。

    3. "云冲印"拥有了获取用户储存在Google所有资料的权力，用户没法限制"云冲印"获得授权的范围和有效期。

    4. 用户只有修改密码，才能收回赋予"云冲印"的权力。但是这样做，会使得其他所有获得用户授权的第三方应用程序全部失效。

    5. 只要有一个第三方应用程序被破解，就会导致用户密码泄漏，以及所有被密码保护的数据泄漏。
> OAuth就是为了解决上面这些问题而诞生的。

# OAuth的思路
> OAuth在"客户端"与"服务提供商"之间，设置了一个授权层（authorization layer）。"客户端"不能直接登录"服务提供商"，只能登录授权层，以此将用户与客户端区分开来。"客户端"登录授权层所用的令牌（token），与用户的密码不同。用户可以在登录的时候，指定授权层令牌的权限范围和有效期。

> "客户端"登录授权层以后，"服务提供商"根据令牌的权限范围和有效期，向"客户端"开放用户储存的资料。

# 运行流程

![Oauth2.0流程图](https://github.com/giserman001/front-end-knowledge--point/blob/master/static/img/auth2.0.png "Oauth2.0流程图")

    （A）用户打开客户端以后，客户端要求用户给予授权。

    （B）用户同意给予客户端授权。

    （C）客户端使用上一步获得的授权，向认证服务器申请令牌。

    （D）认证服务器对客户端进行认证以后，确认无误，同意发放令牌。

    （E）客户端使用令牌，向资源服务器申请获取资源。

    （F）资源服务器确认令牌无误，同意向客户端开放资源。

# 客户端的授权模式
+ 授权码模式（authorization code）
+ 简化模式（implicit）
+ 密码模式（resource owner password credentials）
+ 客户端模式（client credentials）


---

> 注意： 关于更多授权模式的理解可参考阮一峰老师[博客](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)来理解


# HTTP协议的特点

    1.HTTP协议是无状态的
     > 就是说每次HTTP请求都是独立的，任何两个请求之间没有什么必然的联系。但是在实际应用当中并不是完全这样的，引入了Cookie和Session机制来关联请求。
    2.多次HTTP请求
     > 在客户端请求网页时多数情况下并不是一次请求就能成功的，服务端首先是响应HTML页面，然后浏览器收到响应之后发现HTML页面还引用了其他的资源，例如，CSS，JS文件，图片等等，还会自动发送HTTP请求这些需要的资源。现在的HTTP版本支持管道机制，可以同时请求和响应多个请求，大大提高了效率。
    3.基于TCP协议
     > HTTP协议目的是规定客户端和服务端数据传输的格式和数据交互行为，并不负责数据传输的细节。底层是基于TCP实现的。现在使用的版本当中是默认持久连接的，也就是多次HTTP请求使用一个TCP连接。