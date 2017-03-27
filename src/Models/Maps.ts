import { Room } from "./Room";
import { Item } from "./Item";

export interface RoomMap {
    [id: string]: Room;
}

export interface MoveMap {
    [id: string]: string;
}

export interface ItemMap {
    [id: string]: Item;
}
