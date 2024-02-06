const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;

const server = new WebSocket.Server({ port: PORT });

let currentState = 'start-break';

function broadcast(message) {
  server.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    const messageStr = message.toString(); // Convert Buffer to string
    console.log('Received:', messageStr);
    broadcast(messageStr); // Echo back the message as a string
  });

  ws.send('Welcome!');
});

console.log(`Server is running on ws://localhost:${PORT}`);