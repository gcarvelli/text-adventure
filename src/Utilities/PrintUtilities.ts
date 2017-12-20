import { Config } from "../Configuration/Config";
import { Output } from "../Engine/Engine";
import { Item } from "../Models/Models";

export class PrintUtilities {
    public static PrintHeader(config: Config, out: Output) {
        out.Print(config.game.name);
        out.Print(config.game.version);
        out.Print(" ");
    }

    public static LookAround(config: Config, out: Output) {
        out.Clear();
        this.PrintHeader(config, out);
        out.Print(" ");
        out.Print(config.player.location.name);
        out.Print(" ");
        out.PrintLines(config.player.location.GetDescription());
    }

    public static PrintDialogTree(config: Config, out: Output, npc: Item, response?: string) {
        let tree = config.dialogTrees[npc.npc.dialog.startTree];

        out.Clear();
        this.PrintHeader(config, out);
        out.Print(npc.name);
        out.Print(" ");

        if (response) {
            out.Print(response);
        } else {
            out.Print(npc.npc.dialog.greeting);
        }

        out.Print(" ");

        for (let i = 0; i < tree.options.length; i++) {
            out.Print((i + 1) + (tree.options[i].hasBeenChosen ? "" : "*")
                + " -> " + tree.options[i].choice);
        }
        out.Print((tree.options.length + 1) + " -> leave");
    }
}
