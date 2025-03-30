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

    broadcastToRoom() {
        this.sessionClient.send(JSON.stringify({ res: "Hello World!" }));
    }
    
    joinRoom() {

    }

}