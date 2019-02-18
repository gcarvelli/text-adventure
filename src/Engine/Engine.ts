import { GameState } from "../Models/Models";
import { IParser } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { ILoader } from "../Configuration/ILoader";
import { DialogStrategy } from "./DialogStrategy";
import { ExploreStrategy } from "./ExploreStrategy";
import { ExecutionStrategy } from "./ExecutionStrategy";
import { OutputInterface } from "../Output/OutputInterface";
import { Printer } from "../Output/Printer";

export enum EngineMode {
    Explore,
    Dialog,
    Combat
}

export class Engine {
    output: OutputInterface;
    config: Config;
    parser: IParser;
    mode: EngineMode;
    prevMode: EngineMode;
    state: GameState;

    currentStrategy: ExecutionStrategy;
    dialogStrategy: DialogStrategy;
    exploreStrategy: ExploreStrategy;

    public Initialize(loader: ILoader, output: OutputInterface, parser: IParser) {
        this.output = output;
        this.parser = parser;
        this.mode = EngineMode.Explore;
        this.prevMode = this.mode;

        // Load in all rooms
        this.config = loader.LoadConfig();
        this.state = new GameState();

        let printer = new Printer(output);
        this.dialogStrategy = new DialogStrategy(this.config, this.state, printer);
        this.exploreStrategy = new ExploreStrategy(this.config, this.state, printer);
        this.currentStrategy = this.exploreStrategy;

        this.currentStrategy.Start();
    }

    public Execute(commandString: string) {
        this.mode = this.currentStrategy.Execute(this.parser.Parse(commandString));
        switch (this.mode) {
            case EngineMode.Explore:
                this.currentStrategy = this.exploreStrategy;
                break;
            case EngineMode.Dialog:
                this.currentStrategy = this.dialogStrategy;
                break;
        }
        if (this.prevMode != this.mode) {
            // Switching strategies, so initialize the new one
            this.currentStrategy.Start();
        }
        this.prevMode = this.mode;
    }
}
