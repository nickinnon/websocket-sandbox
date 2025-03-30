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
        const prevPositionMap = this.presenceService.getUsersInProximity(this.sessionUserId);
        const nextPostionMap = this.presenceService.moveUser({ coords, userId: this.sessionUserId });

        // Include users that were previously in proximity, but are not anymore.
        const reconciledMap = new Map([ ...prevPositionMap, ...nextPostionMap ]);
        
        reconciledMap.forEach((currentPosition, userId) => {
            const connection = this.clientsRepository.getClient(userId);
            const userProximityMap = this.presenceService.getUsersInProximity(userId);

            connection.send(JSON.stringify({
                type: 'presence/map',
                nearbyUsers: userProximityMap,
            }));
        })
    }

}

export default PresenceController;