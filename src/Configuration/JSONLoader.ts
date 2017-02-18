import { ILoader } from "./ILoader";
import { Game, Item, Player, Room, RoomMap } from "../Models/Models";


export class JSONLoader implements ILoader {
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    public Initialize(data: any) {
        this.data = data;
    }

    public LoadGame(): Game {
        let game = new Game();
        game.name = this.data.name;
        game.version = this.data.version;

        return game;
    }

    public LoadPlayer(): Player {
        let player = new Player();
        if (this.data.items) {
            this.data.items.forEach(item => {
                player.inventory.push(this.LoadItem(item));
            });
        }

        return player;
    }

    public LoadRooms(): RoomMap {
        let rooms = { };
        this.data.rooms.roomlist.forEach(element => {
            let room = this.LoadRoom(element);
            rooms[room.id] = room;
        });

        return rooms;
    }

    public GetStartRoom(): string {
        return this.data.rooms.startroom;
    }

    private LoadRoom(data: any): Room {
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

    private LoadItem(data: any): Item {
        let item = new Item();
        item.id = data.id;
        item.name = data.name;
        item.description = data.description;
        item.roomDescriptionAddition = data.room_description_addition;
        
        return item;
    }
}