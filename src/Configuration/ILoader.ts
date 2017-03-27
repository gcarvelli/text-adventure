import { Config } from "./Config";
import { Game, Player } from "../Models/Simple";
import { RoomMap } from "../Models/Maps";
import { Item } from "../Models/Item";
import { DialogTreeMap } from "../Models/Dialog";

export interface ILoader {
    Initialize(data: any);
    LoadConfig(): Config;
}
