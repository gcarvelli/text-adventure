import { ExecutionStrategy } from "./ExecutionStrategy";
import { Command, CommandType } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { EngineMode } from "./Engine";
import { Item, GameState, DialogTree } from "../Models/Models";
import { PrintUtilities } from "../Utilities/PrintUtilities";
import { EventType } from "../Events/Event";
import { ConditionChecker } from "../Events/ConditionChecker";
import { Printer } from "../Output/Printer";

export class DialogStrategy extends ExecutionStrategy {
    checker: ConditionChecker;
    constructor(config: Config, state: GameState, printer: Printer) {
        super(config, state, printer);
        this.checker = new ConditionChecker(config, printer);
    }

    public Execute(command: Command): EngineMode {
        let mode = EngineMode.Dialog;

        switch (command.commandType) {
            case CommandType.Number:
                if (command.args.length != 0) {
                    let choice = parseInt(command.args[0]);
                    let tree: DialogTree = this.config.dialogTrees[this.state.talkingTo.npc.dialog.startTree];
                    if (choice != NaN && choice > 0 && choice <= tree.options.length + 1) {
                        if (choice == tree.options.length + 1) {
                            // leave
                            mode = EngineMode.Explore;
                            this.state.talkingTo = null;
                        } else {
                            let option = tree.options[choice - 1];
                            let optionIsShown = true;
                            option.GetEvent(EventType.ShowDialogOption).GetConditions().forEach((condition) => {
                                optionIsShown = optionIsShown && condition.IsMet(this.config);
                            });
                            if (optionIsShown) {
                                // Run effects
                                let event = option.GetEvent(EventType.ChooseDialogOption)
                                if (event != null && event.GetEffects() != null) {
                                    event.GetEffects().forEach((effect) => {
                                        effect.Execute(this.config);
                                    });
                                }
                                if (!option.hasBeenChosen) {
                                    option.hasBeenChosen = true;
                                }
                                PrintUtilities.PrintDialogTree(this.config, this.printer, this.state.talkingTo, this.checker, option.response);
                                this.printer.PrintLn();
                            } else {
                                this.printer.PrintLn("You decide to say nothing.");
                            }
                        }
                    } else {
                        this.printer.PrintLn("You decide to say nothing.");
                    }
                } else {
                    this.printer.PrintLn("You decide to say nothing.");
                }
                break;

            case CommandType.Custom:
                this.printer.PrintLn("Sorry, I didn't understand that.");
                break;

            case CommandType.Help:
                this.printer.PrintLn("Choose what to say by entering in the corresponding number.");
                break;

            case CommandType.Empty:
                break;

            default:
                this.printer.PrintLn("You can't do that right now.");
                break;
        }
        if (command.commandType != CommandType.Empty) {
            this.printer.PrintLn();
        }
        return mode;
    }

    public Start() {
        PrintUtilities.PrintDialogTree(this.config, this.printer, this.state.talkingTo, this.checker);
        this.printer.PrintLn();
    }
}
