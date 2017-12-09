import { GameState } from "../Models/Models";
import { IParser } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { ILoader } from "../Configuration/ILoader";
import { DialogStrategy } from "./DialogStrategy";
import { ExploreStrategy } from "./ExploreStrategy";
import { ExecutionStrategy } from "./ExecutionStrategy";
import { PrintUtilities } from "../Utilities/PrintUtilities";

export interface Output {
    Print(output: string);
    PrintLines(output: string[]);
    Clear();
}

export enum EngineMode {
    Explore,
    Dialog,
    Combat
}

export class Engine {
    out: Output;
    config: Config;
    parser: IParser;
    mode: EngineMode;
    state: GameState;

    currentStrategy: ExecutionStrategy;
    dialogStrategy: DialogStrategy;
    exploreStrategy: ExploreStrategy;

    public Initialize(loader: ILoader, out: Output, parser: IParser) {
        this.out = out;
        this.parser = parser;
        this.mode = EngineMode.Explore;

        // Load in all rooms
        this.config = loader.LoadConfig();
        this.state = new GameState();

        this.dialogStrategy = new DialogStrategy(this.config, this.state, this.out);
        this.exploreStrategy = new ExploreStrategy(this.config, this.state, this.out);
        this.currentStrategy = this.exploreStrategy;

        PrintUtilities.LookAround(this.config, this.out);
        this.out.Print(" ");
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
    }
}
