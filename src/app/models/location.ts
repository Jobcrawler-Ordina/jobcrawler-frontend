export class Location {
    id: string;
    name: string;
    lat: number;
    lon: number;
    distance: number;

    constructor(name?: string, lat?: number, lon?: number) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
    }

    setCoord(coord: number[]) {
        this.lat = coord[0];
        this.lon = coord[1];
    }
    getCoord() {
        return [this.lat, this.lon];
    }
}
