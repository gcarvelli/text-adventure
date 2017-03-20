import { Player, Room, RoomMap, Item } from "../Models/Models";
import { Command, CommandType, IParser } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { ILoader } from "../Configuration/ILoader";
import { Utilities } from "../Utilities/Utilities";

export interface Output {
    Print(output: string);
    PrintLines(output: string[]);
    Clear();
}

export enum Mode {
    Explore,
    Dialog
}

export class Engine {
    out: Output;
    config: Config;
    parser: IParser;
    mode: Mode;
    talkingTo: Item;

    private PrintHeader() {
        this.out.Print(this.config.game.name);
        this.out.Print(this.config.game.version);
        this.out.Print(" ");
    }

    public Initialize(loader: ILoader, out: Output, parser: IParser) {
        this.out = out;
        this.parser = parser;
        this.mode = Mode.Explore;

        // Load in all rooms
        this.config = loader.LoadConfig();

        this.LookAround();
        this.out.Print(" ");
    }

    public Execute(commandString: string) {
        let command = this.parser.Parse(commandString);
        switch (this.mode) {
            case Mode.Explore:
                this.ApplyExploreCommand(command);
                break;
            case Mode.Dialog:
                this.ApplyDialogCommand(command);
                break;
        }
        if (command.commandType != CommandType.Empty) {
            this.out.Print(" ");
        }
    }

    private ApplyExploreCommand(command: Command) {
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
                        if (item.open.canOpen) {
                            let status: string;
                            if (item.open.isOpen) {
                                status = "open";
                            } else {
                                if (item.open.lock && item.open.lock.isLocked) {
                                    status = "locked";
                                } else {
                                    status = "closed";
                                }
                            }
                            this.out.Print(item.description + " The " + item.name + " is " + status + ".");
                        } else if (item.door.isDoor) {
                            this.out.Print("The " + item.name + " is " + (item.door.isOpen ? "open." : "closed."));
                        } else {
                            this.out.Print(item.description ? item.description : "There's nothing special about the " + item.name + ".");
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
                        this.out.Print("\t" + item.name);
                    });
                } else {
                    this.out.Print("There doesn't seem to be anything here.");
                }
                break;

            case CommandType.Move:
                if (this.config.player.location.moves.hasOwnProperty(command.args[0])) {
                    this.MoveTo(this.config.player.location.moves[command.args[0]]);
                    this.LookAround();
                    break;
                }

                let door = this.config.player.location.items.filter(i => i.door.isDoor && i.door.isOpen &&
                    i.door.movement.hasOwnProperty(command.args[0]));
                if (door.length > 0) {
                    this.MoveTo(door[0].door.movement[command.args[0]]);
                    this.LookAround();
                    break;
                }

                this.out.Print("You can't go that way right now.");
                break;

            case CommandType.TakeItem:
                if (command.args.length > 0) {
                    // Try the room
                    let item = Utilities.FindItemInList(this.config.player.location.items, command.args[0])
                    if (item != null && item.take.canTake) {
                        let itemIndex = this.config.player.location.items.indexOf(item);
                        //ensure the room contains this item
                        if (itemIndex > -1){
                            this.config.player.location.items.splice(itemIndex, 1);
                            this.config.player.inventory.push(item);
                            this.out.Print("Took the " + item.name + ".");
                            break;
                        }
                    } else if (item != null) {
                        this.out.Print("That can't be taken.");
                        break;
                    }

                    // Try the contents of items in the room
                    let parentItem: Item = null;
                    for (let i = 0; i < this.config.player.location.items.length; i++) {
                        let roomItem = this.config.player.location.items[i];
                        if (roomItem.open.isOpen && roomItem.open.contents) {
                            let possibleMatch = Utilities.FindItemByName(roomItem.open.contents, command.args[0]);
                            if (possibleMatch != null) {
                                parentItem = roomItem;
                                item = possibleMatch;
                                break;
                            }
                        }
                    }
                    if (item != null && item.take.canTake) {
                        parentItem.open.contents.splice(parentItem.open.contents.indexOf(item), 1);
                        this.config.player.inventory.push(item);
                        this.out.Print("Took the " + item.name + ".");
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
                        item.take.wasDropped = true;
                        this.out.Print("Dropped the " + item.name + ".");
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
                        if (item.open.canOpen) {
                            // The item can be opened
                            if (!item.open.isOpen) {
                                // The item isn't open
                                if (item.open.lock && item.open.lock.isLocked) {
                                    // Unlock it if possible
                                    let matches = this.config.player.inventory.filter((i) => i.id == item.open.lock.keyId);
                                    if (matches.length > 0) {
                                        this.out.Print("The " + item.name + " is unlocked with the " + matches[0].name + "!");
                                        item.open.lock.isLocked = false;
                                    } else {
                                        this.out.Print("The " + item.name + " is locked.");
                                    }
                                }

                                if (!item.open.lock || !item.open.lock.isLocked) {
                                    item.open.isOpen = true;
                                    if (item.open.contents.length > 0) {
                                        this.out.Print("You open the " + item.name + ", revealing:");
                                        item.open.contents.forEach(element => {
                                            this.out.Print("  " + element.name);
                                        });
                                    } else {
                                        this.out.Print("You open the " + item.name + ".");
                                    }
                                }
                            } else {
                                // The item is already open
                                this.out.Print("It's already open.");
                            }
                        } else if (item.door.isDoor) {
                            // The item is a door
                            if (!item.door.isOpen) {
                                // The door isn't open
                                item.door.isOpen = true;
                                this.out.Print("You open the " + item.name + ".");
                            } else {
                                // The item is already open
                                this.out.Print("It's already open.");
                            }
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
                        if (item.open.canOpen) {
                            if (item.open.isOpen) {
                                item.open.isOpen = false;
                                this.out.Print("You close the " + item.name + ".");
                            } else {
                                this.out.Print("It's already closed.");
                            }
                        } else if (item.door.isDoor) {
                            if (item.door.isOpen) {
                                item.door.isOpen = false;
                                this.out.Print("You close the " + item.name + ".");
                            } else {
                                this.out.Print("It's already closed.");
                            }
                        } else {
                            this.out.Print("That can't be closed.");
                        }
                    } else {
                        this.out.Print("Doesn't look like there's one of those around.");
                    }
                } else {
                    this.out.Print("Close what?");
                }
                break;

            case CommandType.TalkTo:
                if (command.args.length > 0) {
                    let npc = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (npc != null && npc.npc.dialog) {
                        if (npc.npc.dialog) {
                            this.mode = Mode.Dialog;
                            this.talkingTo = npc;

                            this.PrintDialogTree(npc);
                        } else {
                            this.out.Print("They don't seem like the talking type.");
                        }
                    } else if (npc != null) {
                        this.out.Print("Your attempt at conversation goes unnoticed.");
                    } else {
                        this.out.Print("Doesn't look like they're here.");
                    }
                } else {
                    this.out.Print("Talk to whom?")
                }
                break;

            case CommandType.Help:
                this.out.PrintLines(this.config.help);
                break;

            case CommandType.Custom:
                if (command.args.length > 0) {
                    // Might be a move
                    if (this.config.player.location.moves.hasOwnProperty(command.args[0])) {
                        this.MoveTo(this.config.player.location.moves[command.args[0]]);
                        this.LookAround();
                        break;
                    }
                }
                this.out.Print("Sorry, I didn't understand that.");
                break;

            case CommandType.Empty:
                break;

            default:
                this.out.Print("Well shucks, looks like I can't do that yet.");
                break;
        }
    }

    private ApplyDialogCommand(command: Command) {
        switch (command.commandType) {
            case CommandType.DialogOption:
                if (command.args.length != 0) {
                    let choice = parseInt(command.args[0]);
                    let tree = this.config.dialogTrees[this.talkingTo.npc.dialog.startTree];
                    if (choice != NaN && choice > 0 && choice <= tree.options.length + 1) {
                        if (choice == tree.options.length + 1) {
                            // leave
                            this.mode = Mode.Explore;
                            this.talkingTo = null;
                            this.LookAround();
                        } else {
                            let option = tree.options[choice - 1];
                            option.hasBeenChosen = true;
                            option.RunEffects();
                            this.PrintDialogTree(this.talkingTo, option.response);
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

            default:
                this.out.Print("You can't do that right now.");
                break;
        }
    }

    private MoveTo(location: string) {
        this.config.player.location = this.config.rooms[location];
    }

    private LookAround() {
        this.out.Clear();
        this.PrintHeader();
        this.out.Print(" ");
        this.out.Print(this.config.player.location.name);
        this.out.Print(" ");
        this.out.PrintLines(this.config.player.location.GetDescription());
    }

    private PrintDialogTree(npc: Item, response?: string) {
        let tree = this.config.dialogTrees[npc.npc.dialog.startTree];

        this.out.Clear();
        this.PrintHeader();
        this.out.Print(npc.name);
        this.out.Print(" ");

        if (response) {
            this.out.Print(response);
        } else {
            this.out.Print(npc.npc.dialog.greeting);
        }

        this.out.Print(" ");

        for (let i = 0; i < tree.options.length; i++) {
            this.out.Print((i + 1) + (tree.options[i].hasBeenChosen ? "" : "*")
                + " -> " + tree.options[i].choice);
        }
        this.out.Print((tree.options.length + 1) + " -> leave");
    }
}
