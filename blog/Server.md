
# Server

> Server包作为整个服务的提供者和启动入口，这里的Server指的是程序启动和初始化相关的函数API


目前Server提供了两个启动方式:

1. 基于TLS证书启动，https访问
2. Http启动(还在测试中，属于feature功能)

## TLS启动:

相关函数:

初始化Server:**server.NewServer(TLSPem, TLSKey, port string)**

启动Server:**\*Server.StartServer()**

### 参数说明:

#### TSLPem和TLSKey

TSL证书的pem和key文件路径，可以是相对路径也可以是绝对路径，如果没有值则传""即可(空值为默认自动生成证书，生成自签名证书)

> **注意** TSLPem和TLSKey必须同时传，不能只传一个，否则会启动失败

#### port

监听的端口号，格式为: `:number`，会占用目标端口的TCP和UDP端口，请提前开启目标端口的防火墙，以免接收不到包


## Http启动

初始化Server:**server.NewHttpServer(port string)**

启动HttpServer:**\*Server.StartHttpSerer()**

### 参数说明:

#### port

监听的端口号，格式为: `:number`，会占用目标端口的TCP端口，请提前开启目标端口的防火墙，以免接收不到包
