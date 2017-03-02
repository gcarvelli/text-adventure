import { ILoader } from "./ILoader";
import { Game, Player, Room, RoomMap } from "../Models/Models";
import { DialogTreeMap } from "../Models/Dialog";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;
    dialogTrees: DialogTreeMap;
    help: string[];

    constructor(loader: ILoader) {
        this.rooms = { };

        this.game = loader.LoadGame();
        this.player = loader.LoadPlayer();
        this.rooms = loader.LoadRooms();
        this.dialogTrees = loader.LoadDialogTrees(this);
        this.help = loader.LoadHelp();

        // Set player start room
        this.player.location = this.rooms[loader.GetStartRoom()];
    }
}
