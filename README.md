# react-chat-demo
React 即时聊天 Demo, 支持2人以上在线聊天, 且实时显示已读和未读信息.

## 项目依赖
react: v15.4.2  
react-dom: v15.4.2  
socket.io: v2.1.1  
socket.io-client: v2.1.1  
uuid: v3.3.2  
core-js: v2.5.7
webpack: v2.x.x
babel: v6.x.x

## 兼容浏览器
Chrome, IE9

## 安装教程
下载项目后在根目录执行
```  
npm install
```

## 使用说明
1. 进入bin目录, window下执行test.bat, linux下执行test.sh.    
2. 服务器启动后, 即可在浏览器输入: http://localhost:8080    
3. 打开新窗口, 重复上一步, 可支持多人聊天.  
4. 点击"(已读)"会弹出已读的用户id.  

## 配置说明
devServer服务端口默认为8080.  
webSocket服务端口默认为3000.  
如遇端口冲突, 可以在package.json中配置:  
```
"devServer": {
  "port": 8080
},
"webSocket": {
  "port": 3000
}
```

## Perf测试
在浏览器控制台输入如下代码, 即可查看整体性能(index.jsx中已经执行Perf.start()).
```
Perf.stop();
Perf.printWasted(Perf.getLastMeasurements());
Perf.start();
```