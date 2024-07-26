---

---

# Handler

用于处理HTTP请求并写入响应

## 对应函数:
> 普通路由注册

**\*Server.AddHttpHandler(path, HttpMethod string, handler RouteDisPatch.HttpHandle)**

> 参数路由注册(参数默认位置在请求体/请求头)
> 
> 也有更方便的方式，请查看下文的feature

**\*Server.AddBodyParamHandler(path, HttpMethod string, param interface\{\}, handler RouteDisPatch.HttpHandle)**


**\*Server.AddHeaderParamHandler(path, HttpMethod string, param interface\{\}, handler RouteDisPatch.HttpHandle)**

## 参数说明:

### path
绑定的http请求路径
请求值可以为:
1. 正常字符串:

> 如`/helloWorld`,匹配的就是访问`https://{basURL}/helloWorld`的请求


2. 通配符*或**

*匹配当前一级的所有目录

**匹配当前目录下的所有请求

> 如`/user/role/*/userData`匹配的就是访问如:
>
>`https://{basURL}/user/role/1/userData`
>
>`https://{basURL}/user/role/2/userData`
>
> 的所有请求

> 如`/user/role/**`匹配的就是访问如:
>
> `https://{basURL}/user/role/abc`
>
> `https://{basURL}/user/role/dc/userData`
> 
> 的所有请求

3. 规则请求

类似于:`{name(string):step(uint)}`
例子:
> `/user/{userName:1}`
> 
> `/userName/{fullName:2}`

对应匹配的请求路径:

> `/user/ben`
> 
> `/userName/Alice/Center`

> **注意:** 推荐和param，参数路由注册一起使用

### HttpMethod

Http请求方法，和http规范中的请求方法同步，推荐直接使用
```go
http.Methodxxx
```
进行声明

### param

参数路由必填参数，必须是结构体指针(如欲使用自动注入请求参数的话)

对应函数

默认参数在请求体中

**\*Server.AddBodyParamHandler(path, HttpMethod string, param interface\{\}, handler RouteDisPatch.HttpHandle)**


参数默认在请求头中

**\*Server.AddHeaderParamHandler(path, HttpMethod string, param interface\{\}, handler RouteDisPatch.HttpHandle)**

设计初衷:

在开发中经常会有一个接口参数会来自如下地方:
1. 请求头拿到token/其他权限相关数据
2. 请求体中拿到实际请求的数据
3. 请求path中拿到id等相关的路径信息(结合path中的规则请求使用)

导致可能一个很简单的接口，需要从三个不同的地方分别解析得到数据，所以，本框架将这三个地方的数据都进行一个处理，只需开发者注册路由时调用一个不同的注册函数即可在HttpHandle主体处理函数拿到对应的数据

对于param结构体没有太多的要求，如果是调用AddBodyParamHandler进行注册的话，则请求会从请求的Form表单获取数据，如果是AddHeaderParamHandler的话，请求会从请求头中拿取数据

但请注意，如果是需要从请求头/Form表单拿取数据的话，那么结构体中不能再嵌套结构体，并且类型只能是golang的基础数据类型，不然会注入失败(json数据不受单层结构体的限制，AddBodyParamHandler和AddHeaderParamHandler均可注入成功)

> 额外说明

如果是既有formData/headerData的情况，可以使用结构体注释来标注,目前的注释结构如下:

```go
const (
	locationTag  = "quickLoc"     //参数位置在哪
	defaultValue = "quickDefault" //参数默认值
	param        = "quickParam"   //参数对应的param名字，类似于 `json:"name"`
)

const (
	header   = "header"	// http请求头传参
	body     = "body"	//Body传参(目前暂时未做对应操作)
	reqParam = "param" //param传参,类似于www.baidu.com?name=Baidu
)
```
举个例子:

```go
package main
import(
		"fmt"
	"github.com/wangshiben/QuicFrameWork/server"
	"github.com/wangshiben/QuicFrameWork/server/RouteDisPatch"
	"github.com/wangshiben/QuicFrameWork/server/RouteHand"
	"net/http"
)
type TestStruct struct {
	Name         string
	RequestParam string `quickLoc:"param"`
	Header       string `quickLoc:"header"`
	Age          int    `quickLoc:"param"`
}
func main() {
	//可信的证书
	newServer := server.NewServer("cert.pem", "cert.key", ":4445")
	newServer.AddBodyParamHandler("/temp/**", http.MethodPost, &TestStruct{}, func(w http.ResponseWriter, r *RouteDisPatch.Request) {
		testStruct := r.Param.(*TestStruct)
		fmt.Println(*testStruct)
	})
}

```


### HttpHandle

处理函数，对于经过Filter过滤的请求进行实际处理

函数具体格式如下:

```go
 func(w http.ResponseWriter, r *RouteDisPatch.Request) {

 }

```
1. http.ResponseWriter:

就是net/http包中的ResponseWriter，可直接使用其相应参数

2. RouteDisPatch.Request:

内封装了两个参数:http.Request和Param interface\{\}

http.Request就是net/http包中原生的http.Request,Param interface\{\}就是在调用AddBodyParamHandler或AddHeaderParamHandler中的Param使用时，需要对其强制转换一下,如果不想手写强制转换，推荐使用下面feature的功能


## feature(还未严格测试，如有bug请及时反馈)


主要是简化自动注入流程，不需要开发人员手动强制转换类型

> 可以移步至源码查看，主要是调用之前新增了一次强制转换:
> https://github.com/wangshiben/QuicFrameWork/blob/master/server/RouteHand/routAdd.go
>
> 没有文档是因为可能随时都在变

调用示例:

```go
package main
import(
		"fmt"
	"github.com/wangshiben/QuicFrameWork/server"
	"github.com/wangshiben/QuicFrameWork/server/RouteDisPatch"
	"github.com/wangshiben/QuicFrameWork/server/RouteHand"
	"net/http"
)
type TestStruct struct {
	Name         string
	RequestParam string `quickLoc:"param"`
	Header       string `quickLoc:"header"`
	Age          int    `quickLoc:"param"`
}
func main() {
	//可信的证书
	newServer := server.NewServer("cert.pem", "cert.key", ":4445")
RouteHand.PostAutowired(newServer, "/mmm/bck/**", func(q *RouteHand.QuickFrameWork[TestStruct]) {
		param := q.Param
		fmt.Println(param)
	})
}
```

