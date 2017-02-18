import { Game, Item, Player, Room, RoomMap } from "../Models/Models";

export class Loader {
    public LoadRoom(data: any): Room {
        let room = new Room();
        room.id = data.id;
        room.name = data.name;
        room.description = data.description;

        if (data.items) {
            data.items.forEach(item => {
                room.items.push(this.LoadItem(item));
            });
        }

        if (data.moves) {
            // Read all the moves from the dictionary
            for (var move in data.moves) {
                if (data.moves.hasOwnProperty(move)) {
                    room.moves[move] = data.moves[move];
                }
            }
        }
    
        return room;
    }

    public LoadItem(data: any): Item {
        let item = new Item();
        item.id = data.id;
        item.name = data.name;
        item.description = data.description;
        item.roomDescriptionAddition = data.room_description_addition;
        
        return item;
    }
}