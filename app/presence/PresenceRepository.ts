import { Coords } from "./types/Coords";

class PresenceRepository {
    private userLocations: Map<string, Coords> = new Map();

    updatePosition({ userId, coords }) {
        this.userLocations.set(userId, coords);
        return this.userLocations;
    }

    getUserPosition(userId) {
        return this.userLocations.get(userId);
    }

    getAllCoords() {
        return this.userLocations;
    }
}

export default new PresenceRepository();