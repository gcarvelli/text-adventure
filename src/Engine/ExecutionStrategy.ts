import { Command } from "../Parse/IParser";
import { EngineMode } from "./Engine";
import { Config } from "../Configuration/Config";
import { GameState } from "../Models/Models";
import { Printer } from "../Output/Printer";

export abstract class ExecutionStrategy {
    config: Config;
    state: GameState;
    printer: Printer;

    constructor(config: Config, state: GameState, printer: Printer) {
        this.config = config;
        this.state = state;
        this.printer = printer;
    }

    abstract Execute(command: Command): EngineMode;

    abstract Start();
}
