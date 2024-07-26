---
id: my-blog-post
title: HttpFilter

---

# 拦截器/中间件

其实对于Filter也好，Middleware也罢，他们的基本流程的都是一样的，都是在Handler处理HTTP请求之前对Http请求进行一个预操作，但两者的区别主要还是在使用面向的对象上

Filter注重于在某个http请求的Path之前进行调用，换句话说，它专注在http的Path进行匹配和处理

Middleware注重于在执行代码/函数之前进行调用，可复用程度广，但容易造成一些可读性的问题

所以本框架为了保证开发人员的轻量化开发，采用的是Filter式的请求拦截策略

## 涉及函数:

**\*Server.AddFilter(path string, filter RouteDisPatch.HttpFilter)**

## 参数说明


### path

绑定的http拦截器的路径
请求值可以为:
1. 正常字符串:

> 如`/helloWorld`,匹配的就是访问`https://{basURL}/helloWorld`的请求


2. 通配符*或**

*拦截当前一级的所有目录

**拦截当前目录下的所有请求

> 如`/user/role/*/userData`拦截的就是访问如:
>
>`https://{basURL}/user/role/1/userData`
>
>`https://{basURL}/user/role/2/userData`
>
> 的所有请求

> 如`/user/role/**`拦截的就是访问如:
>
> `https://{basURL}/user/role/abc`
>
> `https://{basURL}/user/role/dc/userData`
> 
> 的所有请求


### HttpFilter

拦截函数，对于每个http请求进行链式调用和处理

函数具体格式如下:
```go
 func(w http.ResponseWriter, r *RouteDisPatch.Request, next RouteDisPatch.Next) {

 }
```

其中`http.ResponseWriter`是golang原生`net/http``包中的ResponseWriter`

`RouteDisPatch.Request`是对golang原生`net/http`包进行了一层封装，具体的可查看Handler中的定义

`RouteDisPatch.Next`是拦截器的链式调用:

在一个具体路径上，如`/name/age/id`的实际请求上，可能会有如下path的拦截器:
`/name/**`,`/name/age/**`,`/name/age/id`，那么，这一系列的拦截器加`Handler`函数就构成了一套完整的请求链，排列方式是:父级路径的拦截器在前，子级拦截器的路径在后，最后才是对应路径的`Handler`函数

拦截器执行下一步是调用next函数，将`http.ResponseWriter`, `RouteDisPatch.Request`传递下去即可，框架在执行到末端时会自动调用Handler

示例:

```go
package main
import(
		"fmt"
	"github.com/wangshiben/QuicFrameWork/server"
	"github.com/wangshiben/QuicFrameWork/server/RouteDisPatch"
	"github.com/wangshiben/QuicFrameWork/server/RouteHand"
	"net/http"
)
func main() {
	//可信的证书
	newServer := server.NewServer("cert.pem", "cert.key", ":4445")
	newServer.AddFilter("/test/**", func(w http.ResponseWriter, r *RouteDisPatch.Request, next RouteDisPatch.Next) {
		fmt.Println("拦截到了请求")
		next.Next(w, r)
		fmt.Println("拦截请求结束")
	})
}
```

## CROS(跨域配置)

这部分感谢[@tiansuo114](https://github.com/tiansuo114)进行开发测试

主要函数:
```go
type CORSConfig struct {
	//均为http协议中Access-Control-xxx的响应头
	AllowOrigins     []string//允许的源
	AllowMethods     []string//允许的请求方法
	AllowHeaders     []string//允许的请求头
	AllowCredentials bool //允许凭证
	ExposeHeaders    []string//允许前端JS访问的响应头
	MaxAge           int//最大存活时间
}

*Server.CROS(path string, cconf ...cors.CORSConfig) {

}
```

### 参数说明:

#### path

同上述的HttpFilter

#### CORSConfig

跨域配置信息，可查看上述注释

### 用法: 

若没有特殊要求，则推荐直接使用如下方式进行跨域配置:

```go
package main
import(
		"fmt"
	"github.com/wangshiben/QuicFrameWork/server"
	"github.com/wangshiben/QuicFrameWork/server/RouteDisPatch"
	"github.com/wangshiben/QuicFrameWork/server/RouteHand"
	"net/http"
)
func main() {
	//可信的证书
	newServer := server.NewServer("cert.pem", "cert.key", ":4445")
	newServer.CROS("/**")
}
```

> 当时设计此函数时，因为golang没有多态这个概念，所以使用了参数切片来进行伪多态，如果有特殊需求的话，只需要传递一个CROSConfig即可，传多个Config默认启用第一个