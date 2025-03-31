import { WebSocket } from "ws";
import ClientsRepository from "./ClientsRepository";

class ClientService {
    private tickRateMs = 1000; 
    private clientsRepository = ClientsRepository;
    private currentTickId = new Date().toString();
    private tick;

    private messageQueue = new Map<string, Map<string, Set<Object>>>();

    constructor() {
        // TODO: Gracefully terminate connections on server kill
        this.tick = setInterval(this.broadcastTick, this.tickRateMs);
    }

    private broadcastTick = () => {
        ClientsRepository.getAllClients().forEach((socket, userId) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const userMessages = this.messageQueue.get(this.currentTickId).get(userId) || [];
                console.log(this.messageQueue)

                socket.send(JSON.stringify({
                    type: "TICK",
                    tickId: this.currentTickId,
                    messages: [ ...userMessages ],
                }));
            }
        });

        this.setCurrentTickId(new Date().toString());
    }

    public queueMessage = ({userId, message}) => {
        const userQueue = this.messageQueue.get(this.currentTickId);

        if (!userQueue.has(userId)) {
            userQueue.set(userId, new Set());
        }

        userQueue.get(userId).add(message);
    }

    private  setCurrentTickId(nextId) {
        this.messageQueue.set(nextId, new Map());
        this.currentTickId = nextId;
    }
}

export default new ClientService();