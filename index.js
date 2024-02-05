const WebSocket = require('ws');
const http = require('http'); // Import the HTTP module
const server = http.createServer(); // Create an HTTP server
const wss = new WebSocket.Server({ server });

let currentState = 'start-break'; // Default state

function broadcast(message) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        // Convert Buffer to string if necessary
        const messageStr = message.toString();
        console.log('Received from client:', messageStr);

        if (messageStr === 'start-study' || messageStr === 'start-break') {
            currentState = messageStr; // Update the currentState variable
            broadcast(messageStr); // Broadcast this state change to all clients
        } else if (messageStr === 'request-current-state') {
            console.log('Sending current state back to the requesting client:', currentState);
            ws.send(currentState); // Respond only to the requesting client
        }
    });
});

server.listen(80); // Start the server on port 80

console.log('WebSocket server started on ws://localhost:80');
