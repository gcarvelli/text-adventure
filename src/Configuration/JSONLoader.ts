import { ILoader } from "./ILoader";
import { Game, Item, Player, Room, RoomMap, NPC } from "../Models/Models";


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
        game.name = this.data.game.name;
        game.version = this.data.game.version;

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
        for (let roomId in this.data.rooms.roomlist) {
            if (this.data.rooms.roomlist.hasOwnProperty(roomId)) {
                let room = this.LoadRoom(roomId);
                rooms[roomId] = room;
            }
        }

        return rooms;
    }

    public GetStartRoom(): string {
        return this.data.rooms.startroom;
    }

    public LoadHelp(): string[] {
        return this.data.help;
    }

    private LoadRoom(id: string): Room {
        let room = new Room();
        let roomData = this.data.rooms.roomlist[id];

        room.id = roomData.id;
        room.name = roomData.name;
        room.description = roomData.description;

        if (roomData.items) {
            roomData.items.forEach(item => {
                room.items.push(this.LoadItem(item));
            });
        }

        if (roomData.npcs) {
            roomData.npcs.forEach(npc => {
                room.items.push(this.LoadNPC(npc));
            });
        }

        if (roomData.basic_items) {
            roomData.basic_items.forEach(name => {
                let item = new Item();
                item.names = [ name ];
                room.items.push(item);
            });
        }

        if (roomData.moves) {
            // Read all the moves from the dictionary
            for (var move in roomData.moves) {
                if (roomData.moves.hasOwnProperty(move)) {
                    room.moves[move] = roomData.moves[move];
                }
            }
        }
    
        return room;
    }

    private LoadItem(id: string): Item {
        let item = new Item();
        let itemData = this.data.items[id];

        item.id = id;
        this.LoadItemInto(item, itemData);

        return item;
    }

    private LoadNPC(id: string): NPC {
        let npc = new NPC();
        let npcData = this.data.npcs[id];

        npc.id = id;
        this.LoadItemInto(npc, npcData);

        return npc;
    }

    private LoadItemInto(item: Item, itemData: any): void {
        item.names = itemData.name ? itemData.name.split(',') : [ item.id.toLowerCase() ];
        item.description = itemData.description;
        item.descriptionForRoom = itemData.description_for_room;
        item.canTake = itemData.can_take;
        item.canOpen = itemData.can_open;
        if (item.canOpen && itemData.contains_items) {
            itemData.contains_items.forEach(contentId => {
                item.contents.push(this.LoadItem(contentId));
            });
        }
        if (itemData.basic_items) {
            itemData.basic_items.forEach(name => {
                let subItem = new Item();
                subItem.names = [ name ];
                item.subItems.push(subItem);
            });
        }
        if (itemData.items) {
            itemData.items.forEach(subItemId => {
                item.subItems.push(this.LoadItem(subItemId));
            });
        }
    }
}