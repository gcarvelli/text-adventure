import { Game, Player, Room, Item } from "../Models/Models";
import { DialogOption, DialogTree } from "../Models/Dialog";
import { State } from "../Models/State";

export class Config {
    game: Game;
    player: Player;
    rooms: Map<string, Room>;
    dialogTrees: Map<string, DialogTree>;
    dialogOptions: Map<string, DialogOption>;
    help: string[];
    items: Map<string, Item>;
    state: State;

    constructor() {
        this.game = new Game();
        this.player = new Player();
        this.rooms = new Map<string, Room>();
        this.dialogTrees = new Map<string, DialogTree>();
        this.dialogOptions = new Map<string, DialogOption>();
        this.help = new Array<string>();
        this.items = new Map<string, Item>();
        this.state = new State();
    }

    public GetItem(id: string) {
        return this.items.hasOwnProperty(id) ? this.items[id] : null;
    }
}
