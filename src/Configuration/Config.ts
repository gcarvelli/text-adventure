import { Game, Player, Room, RoomMap } from "../Models/Models";
import { Loader } from "./Loader";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;

    constructor(data: any) {
        this.rooms = { };

        let loader = new Loader();

        this.game = loader.LoadGame(data.game);
        this.player = loader.LoadPlayer(data.player);

        data.rooms.roomlist.forEach(element => {
            let room = loader.LoadRoom(element);
            this.rooms[room.id] = room;
        });

        // Set player start room
        this.player.location = this.rooms[data.rooms.startroom];
    }

    
}