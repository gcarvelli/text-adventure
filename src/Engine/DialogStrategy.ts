import { ExecutionStrategy } from "./ExecutionStrategy";
import { Command, CommandType } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { Output, EngineMode } from "./Engine";
import { Item } from "../Models/Item";
import { GameState } from "../Models/Simple";
import { Utilities } from "../Utilities/Utilities";
import { PrintUtilities } from "../Utilities/PrintUtilities";

export class DialogStrategy extends ExecutionStrategy {
    constructor(config: Config, state: GameState, out: Output) {
        super(config, state, out);
    }

    public Execute(command: Command): EngineMode {
        let mode = EngineMode.Dialog;

        switch (command.commandType) {
            case CommandType.Number:
                if (command.args.length != 0) {
                    let choice = parseInt(command.args[0]);
                    let tree = this.config.dialogTrees[this.state.talkingTo.npc.dialog.startTree];
                    if (choice != NaN && choice > 0 && choice <= tree.options.length + 1) {
                        if (choice == tree.options.length + 1) {
                            // leave
                            mode = EngineMode.Explore;
                            this.state.talkingTo = null;
                            PrintUtilities.LookAround(this.config, this.out);
                        } else {
                            let option = tree.options[choice - 1];
                            if (!option.hasBeenChosen) {
                                option.hasBeenChosen = true;
                                option.RunEffects();
                            }
                            PrintUtilities.PrintDialogTree(this.config, this.out, this.state.talkingTo, option.response);
                            this.out.Print(" ");
                        }
                    } else {
                        this.out.Print("You decide to say nothing.");
                    }
                } else {
                    this.out.Print("You decide to say nothing.");
                }
                break;

            case CommandType.Custom:
                this.out.Print("Sorry, I didn't understand that.");
                break;

            case CommandType.Help:
                this.out.Print("Choose what to say by entering in the corresponding number.");
                break;

            case CommandType.Empty:
                break;

            default:
                this.out.Print("You can't do that right now.");
                break;
        }
        if (command.commandType != CommandType.Empty) {
            this.out.Print(" ");
        }
        return mode;
    }
}