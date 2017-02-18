import { Game, Item, Player, Room, RoomMap } from "../Models/Models";

export class Loader {
    public LoadGame(data: any): Game {
        let game = new Game();
        game.name = data.name;
        game.version = data.version;

        return game;
    }

    public LoadPlayer(data: any): Player {
        let player = new Player();
        if (data.items) {
            data.items.forEach(item => {
                player.inventory.push(this.LoadItem(item));
            });
        }

        return player;
    }

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