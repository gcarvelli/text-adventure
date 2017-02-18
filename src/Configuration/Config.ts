import { Game, Player, Room, RoomMap } from "../Models/Models";
import { Loader } from "./Loader";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;

    constructor(data: any) {
        this.rooms = { };

        let loader = new Loader(data);

        this.game = loader.LoadGame();
        this.player = loader.LoadPlayer();
        this.rooms = loader.LoadRooms();

        // Set player start room
        this.player.location = this.rooms[data.rooms.startroom];
    }

    
}