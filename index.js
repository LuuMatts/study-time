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
// Set up WebSocket server event listeners
wss.on('connection', function connection(ws) {
    console.log('Client connected');

    // Send the current state when a new client connects
    ws.send(currentState);

    ws.on('message', function incoming(message) {
        console.log('Received:', message);

        if (message === 'request-current-state') {
            // Send the current state back to the requesting client
            ws.send(currentState);
        } else if (message === 'start-study' || message === 'start-break') {
            // Update the current state and broadcast it
            currentState = message;
            broadcast(message);
        }
    });


  // Send the current state to the newly connected client
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(currentState);
  }
});

console.log(`Server is running on ws://localhost:${PORT}`);
