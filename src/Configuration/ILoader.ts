import { Config } from "./Config";
import { Game, Player, Item } from "../Models/Models";

export interface ILoader {
    Initialize(data: any);
    LoadConfig(): Config;
}
