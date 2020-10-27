export class Location {
    id: string;
    name: string;
    lon: number;
    lat: number;
    distance: number;

    constructor(name?: string, lon?: number, lat?: number) {
        this.name = name;
        this.lon = lon;
        this.lat = lat;
    }

    setCoord(coord: number[]) {
        this.lon = coord[0];
        this.lat = coord[1];
    }
    getCoord() {
        return [this.lon, this.lat];
    }
}
