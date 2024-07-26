---
sidebar_position: 1
---

# 安装和上手

> 确保您当前go版本支持go.mod方式或go get方式安装

## 安装

**go get**

```bash
go get github.com/wangshiben/QuicFrameWork
```

**go.mod**

在您项目的go.mod文件下新增:

```go.mod
require github.com/wangshiben/QuicFrameWork v当前最新版本
```

## 快速上手

只需要在项目启动文件上写如下代码:
```go
func main() {
    //可信的证书      
    newServer := server.NewServer("cert.pem", "cert.key", ":4445")
    // 或: newServer := server.NewServer("", "", ":4445")使用自签名证书
    newServer.AddHttpHandler("/helloWorld", http.MethodGet, func (w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "欢迎访问http3页面")
    })
    //↑注册路由
    //↓启动服务
    newServer.StartServer()
}
```

> 因为quic协议本身是建立在SSL连接上的，在开发过程中，申请可信证书有点麻烦，所以推荐在第一次启动的时候使用 **server.NewServer("", "", ":4445")** 进行自签名证书生成(ESDA基于算法)，后续启动可改成 **server.NewServer("cert.pem", "cert.key", ":4445")** 即可

服务启动后可直接访问`https://localhost:4445/helloWorld`即可
