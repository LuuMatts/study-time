const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
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

console.log('WebSocket server started on ws://localhost:8080');