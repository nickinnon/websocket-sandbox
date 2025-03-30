import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { CredentialUtil } from './security/credentialUtil';
import { Credential } from './security/types/credential';
import { RoomController } from './rooms/RoomController';
import ClientsRepository from './client/ClientsRepository';
import RoomService from './rooms/RoomService';

CredentialUtil.generateBearerTokens()
    .forEach(encodedUser => console.log(`Bearer ${encodedUser}`));

const httpServer = http.createServer();
const wss = new WebSocketServer({ noServer: true });
const credentialUtil = new CredentialUtil();

const globalChatId = RoomService.createRoom({ user: null, name: 'global', description: 'Global Channel' }).id;
console.log(`Global Room ID: ${globalChatId}`);

httpServer.on('upgrade', (req, socket, head) => {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    const user = credentialUtil.decodeCredential(authHeader);
  
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
});

wss.on('connection', (socket: WebSocket, req) => {
    const authHeader = req.headers['authorization'];
    const user = credentialUtil.decodeCredential(authHeader) as Credential;
    
    ClientsRepository.connectClient(user.sub, socket);
    new RoomController(socket).joinRoom({ userId: user.sub, roomId: globalChatId });

    console.log(`Client connected with userID ${user.sub}`);
    socket.send(`Client connected with userID ${user.sub}`);

    new RoomController(socket).createRoom({ 
        userId: user.sub,
        name: `private-${user.sub}`,
        description: 'Your personal room'
    });
  
    socket.on('message', (message: string) => {
      console.log(`Received: ${message}`);

      routeRequest(socket, JSON.parse(message));
    });
  
    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  httpServer.listen(8080, () => {
    
  });

  function routeRequest(socket, request) {
    const { type, ...message } = request;

    switch (type) {
        case 'rooms/message':
            new RoomController(socket).broadcastToRoom(message);
            break;
        case 'rooms/create':
            new RoomController(socket).createRoom(message);
            break;
        default:
            socket.send(`No action not found for type: ${type}`);

    }

  }