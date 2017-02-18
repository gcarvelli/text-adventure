import { Player, Room, RoomMap } from "./Models/Models";
import { Command, CommandType, IParser } from "./Parse/IParser";
import { Config } from "./Configuration/Config";
import { ILoader } from "./Configuration/ILoader";

export interface Output {
    Print(output: string);
    Clear();
}

export class Engine {
    out: Output;
    config: Config;
    parser: IParser;

    private PrintHeader() {
        this.out.Print("House Explorer");
        this.out.Print("Version 0.1.0");
        this.out.Print(" ");
    }

    public Initialize(loader: ILoader, out: Output, parser: IParser) {
        this.out = out;
        this.parser = parser;

        // Load in all rooms
        this.config = new Config(loader);

        this.LookAround();
    }

    public Execute(commandString: string) {
        this.Apply(this.parser.Parse(commandString));
    }

    public Apply(command: Command) {
        this.out.Print(" ");
        switch (command.commandType) {
            case CommandType.LookAround:
                this.LookAround();
                break;
            case CommandType.LookAt:
                if (command.args.length == 0) {
                    this.out.Print("Look at what?");
                } else {
                    let itemName = command.args.join(" ");

                    // Check the room first
                    let matches = this.config.player.location.items.filter(function(item) {
                        return item.name == itemName;
                    });
                    if (matches.length > 0) {
                        this.out.Print(matches[0].description);
                        break;
                    }

                    // Then check the player's inventory
                    matches = this.config.player.inventory.filter(function(item) {
                        return item.name == itemName;
                    });
                    if (matches.length > 0) {
                        this.out.Print(matches[0].description);
                        break;
                    }

                    this.out.Print("Doesn't look like there's one of those around.");
                }
                break;
            case CommandType.Inventory:
                this.out.Print("Inventory:");
                if (this.config.player.inventory.length > 0) {
                    this.config.player.inventory.forEach(item => {
                        this.out.Print("\t" + item.name);
                    });
                } else {
                    this.out.Print("There doesn't seem to be anything here.");
                }
                break;
            case CommandType.Custom:
                if (command.args.length > 0) {
                    // Might be a move
                    console.log(this.config.player.location.moves);
                    if (command.args[0] in this.config.player.location.moves) {
                        let newLocationID = this.config.player.location.moves[command.args[0]];
                        this.config.player.location = this.config.rooms[newLocationID];
                        this.LookAround();
                        break;
                    }
                }
                this.out.Print("Sorry, I didn't understand that.");
                break;
            default:
                this.out.Print("Well shucks, looks like I can't do that yet.");
                break;
        }
    }

    private LookAround() {
        this.out.Clear();
        this.PrintHeader();
        this.out.Print(" ");
        this.out.Print(this.config.player.location.GetDescription());
    }
}