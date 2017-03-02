import { Config } from "./Config";
import { Game, Player, RoomMap, Item } from "../Models/Models";
import { DialogTreeMap } from "../Models/Dialog";

export interface ILoader {
    Initialize(data: any);
    LoadConfig(): Config;
}