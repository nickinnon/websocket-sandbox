import PresenceRepository from "./PresenceRepository";
import { Coords } from "./types/Coords";

class PresenceService {
    private radius = 2;
    private presenceRepository = PresenceRepository;

    getUsersInProximity(userId) {
        const coords = this.presenceRepository.getUserPosition(userId);

        // no previous position
        return coords
            ? this.filterMapByProximity(coords, this.presenceRepository.getAllCoords())
            : [];
    }
    
    moveUser({ userId, coords }) {
        const positionMap = this.presenceRepository.updatePosition({ coords, userId});
        return this.filterMapByProximity(coords, positionMap);
    }

    private filterMapByProximity(position: Coords, presenceMap: Map<string, Coords>) {
        return [...presenceMap].filter((([userId, coords]) => {
            return this.isNearby(this.radius, position, coords);
        }))
    }

    // Squared Euclidean distance algorithm
    private isNearby(radius, p1: Coords, p2: Coords) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;

        // Square Poximity
        return Math.abs(dx) <= radius && Math.abs(dy) <= radius;
    }
}

export default new PresenceService();