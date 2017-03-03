import { Game, Player, RoomMap, ItemMap, NPCMap } from "../Models/Models";
import { DialogTreeMap } from "../Models/Dialog";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;
    dialogTrees: DialogTreeMap;
    help: string[];
    items: ItemMap;
    npcs: NPCMap;

    constructor() {
        this.rooms = { };
        this.dialogTrees = { };
        this.help = new Array<string>();
        this.items = { };
        this.npcs = { };
    }

    public GetItem(id: string) {
        return this.items.hasOwnProperty(id) ? this.items[id] : this.npcs[id];
    }
}
