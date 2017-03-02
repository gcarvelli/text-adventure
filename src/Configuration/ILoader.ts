import { Config } from "./Config";
import { Game, Player, RoomMap } from "../Models/Models";
import { DialogTreeMap } from "../Models/Dialog";

export interface ILoader {
    Initialize(data: any);
    LoadGame(): Game;
    LoadPlayer(): Player;
    LoadRooms(): RoomMap;
    LoadDialogTrees(config: Config): DialogTreeMap;
    LoadHelp(): string[];
    GetStartRoom(): string;
}