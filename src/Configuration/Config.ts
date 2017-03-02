import { Game, Player, RoomMap, ItemMap } from "../Models/Models";
import { DialogTreeMap } from "../Models/Dialog";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;
    dialogTrees: DialogTreeMap;
    help: string[];
    items: ItemMap;

    constructor() {
        this.rooms = { };
        this.dialogTrees = { };
        this.help = new Array<string>();
        this.items = { };
    }
}
