const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }); // 公网服务器端口

// 存储所有连接的客户端（小程序/网页）
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('新客户端连接');
  clients.add(ws);

  // 接收客户端消息并转发给所有其他客户端
  ws.on('message', (data) => {
    console.log('收到消息：', data.toString());
    // 转发给所有连接的客户端（包括小程序和网页）
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  // 客户端断开连接
  ws.on('close', () => {
    console.log('客户端断开');
    clients.delete(ws);
  });
});

console.log('WebSocket服务器启动，监听端口8080');