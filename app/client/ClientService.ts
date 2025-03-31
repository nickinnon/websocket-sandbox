import { WebSocket } from "ws";
import ClientsRepository from "./ClientsRepository";

class ClientService {
    private tickRateMs = 1000; 
    private clientsRepository = ClientsRepository;
    private currentTickId = new Date().toString();
    private tick;

    constructor() {
        // TODO: Gracefully terminate connections on server kill
        this.tick = setInterval(this.broadcastTick, this.tickRateMs);
    }

    private broadcastTick = () => {
        ClientsRepository.getAllClients().forEach((socket, userId) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "TICK",
                    tickId: this.currentTickId,
                }));
            }
        });

        this.currentTickId = new Date().toString();
    }
}

export default new ClientService();