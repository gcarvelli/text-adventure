import { Game, Player, RoomMap } from "../Models/Models";

export interface ILoader {
    Initialize(data: any);
    LoadGame(): Game;
    LoadPlayer(): Player;
    LoadRooms(): RoomMap;
    GetStartRoom(): string;
}