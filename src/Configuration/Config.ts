import { Game, Player, Room, Item } from "../Models/Models";
import { DialogOption, DialogTree } from "../Models/Dialog";
import { IMap } from "../Utilities/Utilities";

export class Config {
    game: Game;
    player: Player;
    rooms: IMap<Room>;
    dialogTrees: IMap<DialogTree>;
    dialogOptions: IMap<DialogOption>;
    help: string[];
    items: IMap<Item>;

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
