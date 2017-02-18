import { Game, Item, Player, Room, RoomMap } from "../Models/Models";

export class Loader {
    public LoadRoom(data: any): Room {
        let room = new Room();
        room.id = data.id;
        room.name = data.name;
        room.description = data.description;
        if (data.items) {
            data.items.forEach(element => {
                room.items.push(this.LoadItem(element));
            });
        }
    
        return room;
    }

    public LoadItem(data: any): Item {
        let item = new Item();
        item.id = data.id;
        item.name = data.name;
        item.description = data.description;
        
        return item;
    }
}