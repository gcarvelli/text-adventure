import { Game, Player, Room, RoomMap } from "../Models/Models";
import { ILoader } from "./ILoader";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;
    help: string[];

    constructor(loader: ILoader) {
        this.rooms = { };

        this.game = loader.LoadGame();
        this.player = loader.LoadPlayer();
        this.rooms = loader.LoadRooms();
        this.help = loader.LoadHelp();

        // Set player start room
        this.player.location = this.rooms[loader.GetStartRoom()];
    }

    
}