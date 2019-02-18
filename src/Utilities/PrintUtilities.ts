import { Config } from "../Configuration/Config";
import { Item } from "../Models/Models";
import { EventType } from "../Events/Event";
import { ConditionChecker } from "../Events/ConditionChecker";
import { Printer } from "../Output/Printer";

export class PrintUtilities {
    public static PrintHeader(config: Config, printer: Printer) {
        printer.PrintLn(config.game.name);
        printer.PrintLn(config.game.version);
        printer.PrintLn();
    }

    public static LookAround(config: Config, printer: Printer) {
        printer.Clear();
        this.PrintHeader(config, printer);
        printer.PrintLn();
        printer.PrintLn(config.player.location.name);
        printer.PrintLn();
        config.player.location.GetDescription().forEach((line) => {
            printer.PrintLn(line);
        });
    }

    public static PrintDialogTree(config: Config, printer: Printer, npc: Item, checker: ConditionChecker, response?: string) {
        let tree = config.dialogTrees[npc.npc.dialog.startTree];

        printer.Clear();
        this.PrintHeader(config, printer);
        printer.PrintLn(npc.name);
        printer.PrintLn();

        if (response) {
            printer.PrintLn(response);
        } else {
            printer.PrintLn(npc.npc.dialog.greeting);
        }

        printer.PrintLn();

        for (let i = 0; i < tree.options.length; i++) {
            let showEvent = tree.options[i].GetEvent(EventType.ShowDialogOption);
            let showOption = true;
            if (showEvent != null) {
                tree.options[i].GetEvent(EventType.ShowDialogOption).GetConditions().forEach((condition) => {
                    showOption = showOption && condition.IsMet(config);
                });
            }
            if (showOption) {
                printer.PrintLn((i + 1) + (tree.options[i].hasBeenChosen ? "" : "*")
                + " -> " + tree.options[i].choice);
            }
            // TODO run ShowOptions effects
        }
        printer.PrintLn((tree.options.length + 1) + " -> leave");
    }
}
