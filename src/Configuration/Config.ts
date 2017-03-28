import { Game, Player } from "../Models/Simple";
import { ItemMap, RoomMap } from '../Models/Maps';
import { DialogTreeMap, DialogOptionMap } from "../Models/Dialog";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;
    dialogTrees: DialogTreeMap;
    dialogOptions: DialogOptionMap;
    help: string[];
    items: ItemMap;

    constructor() {
        this.game = new Game();
        this.player = new Player();
        this.rooms = { };
        this.dialogTrees = { };
        this.dialogOptions = { };
        this.help = new Array<string>();
        this.items = { };
    }

    public GetItem(id: string) {
        return this.items.hasOwnProperty(id) ? this.items[id] : null;
    }
}
