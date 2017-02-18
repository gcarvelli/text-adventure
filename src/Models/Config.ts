import { Game, Player, Room, RoomMap } from "./Models";

export class Config {
    game: Game;
    player: Player;
    rooms: RoomMap;

    constructor(data: any) {
        this.game = new Game(data.game.name, data.game.version);
        this.player = new Player();
        this.player.name = "Gio";
        this.rooms = { };
        data.rooms.roomlist.forEach(element => {
            let room = new Room();
            room.id = element.id;
            room.name = element.name;
            room.description = element.description;
            this.rooms[room.id] = room;
        });

        // Set player start room
        this.player.location = this.rooms[data.rooms.startroom];

    }
}