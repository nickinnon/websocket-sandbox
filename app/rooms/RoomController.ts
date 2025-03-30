import ClientsRepository from "../client/ClientsRepository";
import RoomService from "./RoomService"

export class RoomController {
    private sessionClient: WebSocket;
    private roomService = RoomService;
    private clientRepository = ClientsRepository;

    constructor(client) {
        this.sessionClient = client;
    }

    createRoom(createRoomRequest) {
        const user = createRoomRequest.userId;

        const newRoom = this.roomService.createRoom({
            user,
            name: "Test",
            description: "Description",
        });

        const roomRoster = this.roomService.addUserToRoom({
            userId: user,
            roomId: newRoom.id
        });
    }

    broadcastToRoom(request) {
        const usersInRoom = this.roomService.getUserlistByRoom(request);
        
        for (let user of usersInRoom) {
            const socket = this.clientRepository.getClient(user);

            if (socket) {
                socket.send(JSON.stringify({
                    type: 'rooms/broadcast',
                    message: request.message,
                }));
            }
        }
    }
    
    joinRoom({ userId, roomId }) {
        this.roomService.addUserToRoom({ userId, roomId });

        this.sessionClient.send(JSON.stringify({
            type: 'rooms/join',
            message: `Joined room with id ${roomId}`,
        }));
    }

}