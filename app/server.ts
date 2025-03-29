import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port:8080 });

wss.on('connection', (socket: WebSocket) => {
    console.log('Client connected');
    socket.send(`Client connected with userID`);


  
    socket.on('message', (message: string) => {
      console.log(`Received: ${message}`);

      socket.send(`Echo: ${message}`);
    });
  
    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('WebSocket server running on ws://localhost:8080');