import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { CredentialUtil } from './security/credentialUtil';
import { Credential } from './security/types/credential';
import { RoomController } from './rooms/RoomController';
import ClientsRepository from './client/ClientsRepository';
import RoomService from './rooms/RoomService';
import PresenceController from './presence/PresenceController';
import ClientService from './client/ClientService';

CredentialUtil.generateBearerTokens()
    .forEach(encodedUser => console.log(`Bearer ${encodedUser}`));

const httpServer = http.createServer();
const wss = new WebSocketServer({ noServer: true });
const credentialUtil = new CredentialUtil();
const clientsService = ClientService;

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

    spawnUser(user.sub, socket);
  
    socket.on('message', (message: string) => {
      console.log(`Received: ${message}`);

      routeRequest(socket, JSON.parse(message), user.sub);
    });
  
    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  httpServer.listen(8080, () => {
    
  });

  function spawnUser(userId, socket) {
    ClientsRepository.connectClient(userId, socket);

    // 
    setTimeout(() => ClientService.queueMessage({ userId, message : { message: 'This message will be sent within 3-5 ticks' } }), 3000);

    new RoomController(socket).joinRoom({ userId, roomId: globalChatId });
    new PresenceController(userId, socket).moveUser({ coords: {x: 0, y: 0} });
    new RoomController(socket).createRoom({ 
        userId,
        name: `private-${userId}`,
        description: 'Your personal room'
    });

    console.log(`Client connected with userID ${userId}`);
    socket.send(`Client connected with userID ${userId}`);
  }

  function routeRequest(socket, request, userId) {
    const { type, ...message } = request;

    switch (type) {
        case 'rooms/message':
            new RoomController(socket).broadcastToRoom(message);
            break;
        case 'rooms/create':
            new RoomController(socket).createRoom(message);
            break;
        case 'presence/move':
            new PresenceController(userId, socket).moveUser(message);
            break;
        default:
            socket.send(`No action not found for type: ${type}`);

    }

  }