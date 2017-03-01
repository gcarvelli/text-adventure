import { Player, Room, RoomMap, Item } from "./Models/Models";
import { Command, CommandType, IParser } from "./Parse/IParser";
import { Config } from "./Configuration/Config";
import { ILoader } from "./Configuration/ILoader";
import { Utilities } from "./Utilities/Utilities";

export interface Output {
    Print(output: string);
    PrintLines(output: string[]);
    Clear();
}

export class Engine {
    out: Output;
    config: Config;
    parser: IParser;

    private PrintHeader() {
        this.out.Print(this.config.game.name);
        this.out.Print(this.config.game.version);
        this.out.Print(" ");
    }

    public Initialize(loader: ILoader, out: Output, parser: IParser) {
        this.out = out;
        this.parser = parser;

        // Load in all rooms
        this.config = new Config(loader);

        this.LookAround();
        this.out.Print(" ");
    }

    public Execute(commandString: string) {
        this.Apply(this.parser.Parse(commandString));
    }

    public Apply(command: Command) {
        switch (command.commandType) {
            case CommandType.LookAround:
                this.LookAround();
                break;

            case CommandType.LookAt:
                if (command.args.length == 0) {
                    this.out.Print("Look at what?");
                } else {
                    // Check the room first, then the player's inventory
                    let item = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (item == null) {
                        item = Utilities.FindItemByName(this.config.player.inventory, command.args[0]);
                    }

                    if (item != null) {
                        if (item.canOpen) {
                            this.out.Print(item.description + " The " + item.GetName() + " is " +
                                (item.isOpen ? "open." : "closed."));
                        } else {
                            this.out.Print(item.description ? item.description : "There's nothing special about the " + item.GetName() + ".");
                        }
                    } else {
                        this.out.Print("Doesn't look like there's one of those around.");
                    }
                }
                break;

            case CommandType.Inventory:
                this.out.Print("Inventory:");
                if (this.config.player.inventory.length > 0) {
                    this.config.player.inventory.forEach(item => {
                        this.out.Print("\t" + item.GetName());
                    });
                } else {
                    this.out.Print("There doesn't seem to be anything here.");
                }
                break;

            case CommandType.Move:
                if (this.config.player.location.moves[command.args[0]]) {
                    this.MoveTo(command.args[0]);
                    this.LookAround();
                } else {
                    this.out.Print("You can't go that way right now.");
                }
                break;

            case CommandType.TakeItem:
                if (command.args.length > 0) {
                    // Try the room
                    let item = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (item != null && item.canTake) {
                        this.config.player.location.items.splice(this.config.player.location.items.indexOf(item), 1);
                        this.config.player.inventory.push(item);
                        this.out.Print("Took the " + item.GetName() + ".");
                        break;
                    } else if (item != null) {
                        this.out.Print("That can't be taken.");
                        break;
                    }

                    // Try the contents of items in the room
                    let parentItem: Item = null;
                    for (let i = 0; i < this.config.player.location.items.length; i++) {
                        let roomItem = this.config.player.location.items[i];
                        if (roomItem.isOpen && roomItem.contents) {
                            let possibleMatch = Utilities.FindItemByName(roomItem.contents, command.args[0]);
                            if (possibleMatch != null) {
                                parentItem = roomItem;
                                item = possibleMatch;
                                break;
                            }
                        }
                    }
                    if (item != null && item.canTake) {
                        parentItem.contents.splice(parentItem.contents.indexOf(item), 1);
                        this.config.player.inventory.push(item);
                        this.out.Print("Took the " + item.GetName() + ".");
                        break;
                    } else if (item != null) {
                        this.out.Print("That can't be taken.");
                        break;
                    }

                    this.out.Print("Doesn't look like there's one of those around.");
                } else {
                    this.out.Print("Take what?");
                }
                break;

            case CommandType.DropItem:
                if (command.args.length > 0) {
                    let item = Utilities.FindItemByName(this.config.player.inventory, command.args[0]);
                    if (item != null) {
                        this.config.player.inventory.splice(this.config.player.inventory.indexOf(item), 1);
                        this.config.player.location.items.push(item);
                        item.wasDropped = true;
                        this.out.Print("Dropped the " + item.GetName() + ".");
                    } else {
                        this.out.Print("You don't have one of those.");
                    }
                } else {
                    this.out.Print("Drop what?");
                }
                break;

            case CommandType.Open:
                if (command.args.length > 0) {
                    let item = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (item != null) {
                        if (item.canOpen && !item.isOpen) {
                            item.isOpen = true;
                            if (item.contents.length > 0) {
                                this.out.Print("You open the " + item.GetName() + ", revealing:");
                                item.contents.forEach(element => {
                                    this.out.Print("  " + element.GetName());
                                });
                            } else {
                                this.out.Print("You open the " + item.GetName() + ".");
                            }
                        } else if (item.canOpen && item.isOpen) {
                            this.out.Print("It's already open.");
                        } else {
                            this.out.Print("That can't be opened.");
                        }
                    } else {
                        this.out.Print("Doesn't look like there's one of those around.");
                    }
                } else {
                    this.out.Print("Open what?");
                }
                break;

            case CommandType.Close:
                if (command.args.length > 0) {
                    let item = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (item != null) {
                        if (item.canOpen && item.isOpen) {
                            item.isOpen = false;
                            this.out.Print("You close the " + item.GetName() + ".");
                        } else if (item.canOpen && !item.isOpen) {
                            this.out.Print("It's already closed.");
                        } else {
                            this.out.Print("That can't be closed.")
                        }
                    } else {
                        this.out.Print("Doesn't look like there's one of those around.");
                    }
                } else {
                    this.out.Print("Close what?");
                }
                break;

            case CommandType.Help:
                this.out.PrintLines(this.config.help);
                break;

            case CommandType.Custom:
                if (command.args.length > 0) {
                    // Might be a move
                    if (command.args[0] in this.config.player.location.moves) {
                        this.MoveTo(command.args[0]);
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
        this.out.Print(" ");
    }

    private MoveTo(move: string) {
        let newLocationID = this.config.player.location.moves[move];
        this.config.player.location = this.config.rooms[newLocationID];
    }

    private LookAround() {
        this.out.Clear();
        this.PrintHeader();
        this.out.Print(" ");
        this.out.PrintLines(this.config.player.location.GetDescription());
    }
}