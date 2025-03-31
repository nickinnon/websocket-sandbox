import { v4 as uuid } from 'uuid';
import { WebSocket } from 'ws';

class ClientsRepository {
    private clients : Map<string, WebSocket> = new Map();

    public getClient = (clientId: string) => {
        const client = this.clients.get(clientId);

        return client;
    }

    public connectClient = (userId, connection: WebSocket) => {
        // const clientId = uuid();
        this.clients.set(userId, connection);
    }

    public disconnectClient(clientId: string) {
        const client = this.getClient(clientId);

        if (client) {
            this.clients.delete(clientId);
        }
    }

    public getAllClients() {
        return this.clients;
    }
}

export default new ClientsRepository();