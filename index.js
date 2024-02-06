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
        const messageStr = message.toString();
        console.log('Received:', messageStr); // Ensure this logs the expected state changes

        // Update this section to ensure currentState updates correctly
        if (messageStr === 'start-study' || messageStr === 'start-break') {
            currentState = messageStr;
            broadcast(currentState); // Ensure this broadcasts the new state
        } else if (messageStr === 'request-current-state') {
            ws.send(currentState); // Make sure this sends the updated currentState
        }
    });
});

console.log(`Server is running on ws://localhost:${PORT}`);
