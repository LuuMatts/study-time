const WebSocket = require('ws');

// Determine the port to listen on
const PORT = process.env.PORT || 8080;

// Create a WebSocket Server on the specified port
const wss = new WebSocket.Server({ port: PORT });

// Default state
let currentState = 'start-break';

// Broadcast function to send messages to all connected clients
function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Event listener for new connections to the WebSocket server
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Event listener for messages from the clients
  ws.on('message', function incoming(message) {
    console.log('Received:', message);
    // Update the current state and broadcast the message
    if (message === 'start-study' || message === 'start-break') {
      currentState = message;
    }
    broadcast(message);
  });

  // Send the current state to the newly connected client
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(currentState);
  }
});

console.log(`Server is running on ws://localhost:${PORT}`);
