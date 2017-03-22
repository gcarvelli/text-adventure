import { Command } from "../Parse/IParser";
import { EngineMode, Output } from "./Engine";
import { Config } from "../Configuration/Config";
import { GameState } from "../Models/GameState";

export abstract class ExecutionStrategy {
    config: Config;
    out: Output;
    state: GameState;

    constructor(config: Config, state: GameState, out: Output) {
        this.config = config;
        this.state = state;
        this.out = out;
    }

    abstract Execute(command: Command): EngineMode;
}
