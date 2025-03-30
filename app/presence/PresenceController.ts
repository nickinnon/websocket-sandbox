import ClientsRepository from "../client/ClientsRepository";
import PresenceRepository from "./PresenceRepository";
import PresenceService from "./PresenceService";

class PresenceController {
    private sessionUserId;
    private sessionClient;
    private clientsRepository = ClientsRepository;
    private presenceService = PresenceService;

    constructor(userId, socket) {
        this.sessionUserId = userId;
        this.sessionClient = socket;
    }

    moveUser({ coords }) {
        const positionMap = this.presenceService.moveUser({ coords, userId: this.sessionUserId });
        positionMap.forEach(([userId, currentPosition]) => {
            const connection = this.clientsRepository.getClient(userId);
            const userProximityMap = this.presenceService.filterMapByProximity(currentPosition, new Map(positionMap));

            connection.send(JSON.stringify({
                type: 'presence/map',
                nearbyUsers: userProximityMap,
            }));
        })
    }

}

export default PresenceController;