export class Location {
    id: string;
    name: string;
    lon: number;
    lat: number;
    distance: number;

    constructor(name: string) {
        this.name = name;
    }

    setCoord(coord: number[]) {
        this.lon = coord[0];
        this.lat = coord[1];
    }
    getCoord() {
        return [this.lon, this.lat];
    }
}
