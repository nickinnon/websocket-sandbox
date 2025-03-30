import { v4 as uuidv4 } from 'uuid';
import { Room } from './types/Room';

class RoomService {
    private chatRooms: Map<string, Room> = new Map();
    
    // In memory Many:Many relationship
    private userToRooms = new Map<string, Set<string>>();
    private roomToUsers = new Map<string, Set<string>>();

    createRoom({user, name, description}) {
        const id = 'aeea2113-3a11-4041-9b41-d88c93eb9315';//uuidv4();
        const room = {
            id,
            name,
            description,
        } as Room;

        this.chatRooms.set(id, room);

        if (user) {
            this.addUserToRoom({ 
                userId: user.id,
                roomId: room.id
             });
        }

        return this.chatRooms.get(id);
    }

    addUserToRoom({userId, roomId}) {
        if (!this.userToRooms.has(userId)) {
            this.userToRooms.set(userId, new Set());
        }

        if (!this.roomToUsers.has(roomId)) {
            this.roomToUsers.set(roomId, new Set());
        }

        console.log(`Add user ${userId} to room ${roomId}`);

        this.userToRooms.get(userId).add(roomId);
        this.roomToUsers.get(roomId).add(userId);

        return this.roomToUsers.get(roomId);
    }

    getUserlistByRoom({roomId}) {
        return this.roomToUsers.get(roomId);
    }

}

export default new RoomService();