import { v4 as uuid } from 'uuid';

class ClientsRepository {
    private clients : Map<string, WebSocket> = new Map();

    public getClient = (clientId: string) => {
        const client = this.clients.get(clientId);

        return client;
    }

    public connectClient = (connection: WebSocket) => {
        const clientId = uuid();
        this.clients.set(clientId, connection);
    }

    public disconnectClient(clientId: string) {
        const client = this.getClient(clientId);

        if (client) {
            this.clients.delete(clientId);
        }
    }
}

export default new ClientsRepository();