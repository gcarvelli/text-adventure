import { ILoader } from "./ILoader";
import { Game, Item, Player, Room, RoomMap } from "../Models/Models";


export class JSONLoader implements ILoader {
    data: any;

    constructor(data?: any) {
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
        if (this.data.player.items) {
            this.data.player.items.forEach(item => {
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

    public LoadHelp(): string[] {
        return this.data.help;
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

    private LoadItem(id: string): Item {
        let item = new Item();
        let itemData = this.data.items[id];

        item.id = id;
        item.name = itemData.name ? itemData.name : id.toLowerCase();
        item.description = itemData.description;
        item.descriptionForRoom = itemData.description_for_room;
        item.canTake = itemData.can_take;
        
        return item;
    }
}