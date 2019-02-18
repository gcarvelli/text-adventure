import { ExecutionStrategy } from "./ExecutionStrategy";
import { Command, CommandType } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { EngineMode } from "./Engine";
import { Item } from "../Models/Models";
import { GameState } from "../Models/Simple";
import * as Utilities from "../Utilities/Utilities";
import { PrintUtilities } from "../Utilities/PrintUtilities";
import { ConditionChecker } from "../Events/ConditionChecker";
import { EventType } from "../Events/Event";
import { Printer } from "../Output/Printer";

export class ExploreStrategy extends ExecutionStrategy {
    config: Config;
    printer: Printer;
    state: GameState;
    checker: ConditionChecker;

    constructor(config: Config, state: GameState, printer: Printer) {
        super(config, state, printer);
        this.checker = new ConditionChecker(config, printer);
    }

    public Execute(command: Command): EngineMode {
        let mode = EngineMode.Explore;

        switch (command.commandType) {
            case CommandType.LookAround:
                PrintUtilities.LookAround(this.config, this.printer);
                break;

            case CommandType.LookAt:
                if (command.args.length == 0) {
                    this.printer.PrintLn("Look at what?");
                } else {
                    // Check the room first, then the player's inventory
                    let item = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (item == null) {
                        item = Utilities.FindItemByName(this.config.player.inventory, command.args[0]);
                    }

                    if (item != null) {
                        this.printer.PrintLn(item.GetLookAtDescription());
                    } else {
                        this.printer.PrintLn("Doesn't look like there's one of those around.");
                    }
                }
                break;

            case CommandType.Inventory:
                this.printer.PrintLn("Inventory:");
                if (this.config.player.inventory.length > 0) {
                    this.config.player.inventory.forEach(item => {
                        this.printer.PrintLn(this.printer.TAB + item.name);
                    });
                } else {
                    this.printer.PrintLn(this.printer.TAB + "There doesn't seem to be anything here.");
                }
                break;

            case CommandType.Move:
                if (this.config.player.location.moves.hasOwnProperty(command.args[0])) {
                    this.MoveTo(this.config.player.location.moves[command.args[0]]);
                    PrintUtilities.LookAround(this.config, this.printer);
                    break;
                }

                let door = this.config.player.location.items.filter(i => i.door.isDoor && i.door.isOpen &&
                    i.door.movement.hasOwnProperty(command.args[0]));
                if (door.length > 0) {
                    this.MoveTo(door[0].door.movement[command.args[0]]);
                    PrintUtilities.LookAround(this.config, this.printer);
                    break;
                }

                this.printer.PrintLn("You can't go that way right now.");
                break;

            case CommandType.TakeItem:
                if (command.args.length > 0) {
                    let item:Item;
                    let container:Item[];

                    // Try the room
                    item = Utilities.FindItemInList(this.config.player.location.items, command.args[0])
                    if (item != null) {
                        container = this.config.player.location.items;
                    }

                    // Try the contents of items in the room
                    if (item == null && container == null) {
                        for (let i = 0; i < this.config.player.location.items.length; i++) {
                            let roomItem = this.config.player.location.items[i];
                            if (roomItem.open.isOpen && roomItem.open.contents) {
                                let possibleMatch = Utilities.FindItemByName(roomItem.open.contents, command.args[0]);
                                if (possibleMatch != null) {
                                    container = roomItem.open.contents;
                                    item = possibleMatch;
                                    break;
                                }
                            }
                        }
                    }

                    // Remove the item
                    if (item != null) {
                        if (item.take.canTake) {
                            // Check custom rules
                            let event = item.GetEvent(EventType.Take);
                            if (event == null || this.checker.CheckAll(event.GetConditions())) {
                                container.splice(container.indexOf(item), 1);
                                this.config.player.inventory.push(item);
                                this.printer.PrintLn("Took the " + item.name + ".");
                            }
                        } else {
                            this.printer.PrintLn("That can't be taken.")
                        }
                    } else {
                        this.printer.PrintLn("Doesn't look like there's one of those around.");
                    }
                } else {
                    this.printer.PrintLn("Take what?");
                }
                break;

            case CommandType.DropItem:
                if (command.args.length > 0) {
                    let item = Utilities.FindItemByName(this.config.player.inventory, command.args[0]);
                    if (item != null) {
                        this.config.player.inventory.splice(this.config.player.inventory.indexOf(item), 1);
                        this.config.player.location.items.push(item);
                        item.take.wasDropped = true;
                        this.printer.PrintLn("Dropped the " + item.name + ".");
                    } else {
                        this.printer.PrintLn("You don't have one of those.");
                    }
                } else {
                    this.printer.PrintLn("Drop what?");
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
                                        this.printer.PrintLn("The " + item.name + " is unlocked with the " + matches[0].name + "!");
                                        item.open.lock.isLocked = false;
                                    } else {
                                        this.printer.PrintLn("The " + item.name + " is locked.");
                                    }
                                }

                                if (!item.open.lock || !item.open.lock.isLocked) {
                                    item.open.isOpen = true;
                                    if (item.open.contents.length > 0) {
                                        this.printer.PrintLn("You open the " + item.name + ", revealing:");
                                        item.open.contents.forEach(element => {
                                            this.printer.PrintLn("  " + element.name);
                                        });
                                    } else {
                                        this.printer.PrintLn("You open the " + item.name + ".");
                                    }
                                }
                            } else {
                                // The item is already open
                                this.printer.PrintLn("It's already open.");
                            }
                        } else if (item.door.isDoor) {
                            // The item is a door
                            if (!item.door.isOpen) {
                                // The door isn't open
                                item.door.isOpen = true;
                                this.printer.PrintLn("You open the " + item.name + ".");
                            } else {
                                // The item is already open
                                this.printer.PrintLn("It's already open.");
                            }
                        } else {
                            this.printer.PrintLn("That can't be opened.");
                        }
                    } else {
                        this.printer.PrintLn("Doesn't look like there's one of those around.");
                    }
                } else {
                    this.printer.PrintLn("Open what?");
                }
                break;

            case CommandType.Close:
                if (command.args.length > 0) {
                    let item = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (item != null) {
                        if (item.open.canOpen) {
                            if (item.open.isOpen) {
                                item.open.isOpen = false;
                                this.printer.PrintLn("You close the " + item.name + ".");
                            } else {
                                this.printer.PrintLn("It's already closed.");
                            }
                        } else if (item.door.isDoor) {
                            if (item.door.isOpen) {
                                item.door.isOpen = false;
                                this.printer.PrintLn("You close the " + item.name + ".");
                            } else {
                                this.printer.PrintLn("It's already closed.");
                            }
                        } else {
                            this.printer.PrintLn("That can't be closed.");
                        }
                    } else {
                        this.printer.PrintLn("Doesn't look like there's one of those around.");
                    }
                } else {
                    this.printer.PrintLn("Close what?");
                }
                break;

            case CommandType.TalkTo:
                if (command.args.length > 0) {
                    let npc = Utilities.FindItemByName(this.config.player.location.items, command.args[0]);
                    if (npc != null && npc.npc.dialog) {
                        if (npc.npc.dialog) {
                            mode = EngineMode.Dialog;
                            this.state.talkingTo = npc;
                        } else {
                            this.printer.PrintLn("They don't seem like the talking type.");
                        }
                    } else if (npc != null) {
                        this.printer.PrintLn("Your attempt at conversation goes unnoticed.");
                    } else {
                        this.printer.PrintLn("Doesn't look like they're here.");
                    }
                } else {
                    this.printer.PrintLn("Talk to whom?")
                }
                break;

            case CommandType.Help:
                this.config.help.forEach((line) => {
                    this.printer.PrintLn(line);
                })
                break;

            case CommandType.Custom:
                this.printer.PrintLn("Sorry, I didn't understand that.");
                break;

            case CommandType.Empty:
                break;

            default:
                this.printer.PrintLn("Well shucks, looks like I can't do that yet.");
                break;
        }
        if (command.commandType != CommandType.Empty) {
            this.printer.PrintLn();
        }
        if (mode == EngineMode.Explore) {
            this.printer.Prompt();
        }
        return mode;
    }

    public Start() {
        PrintUtilities.LookAround(this.config, this.printer);
        this.printer.PrintLn();
        this.printer.Prompt();
    }

    private MoveTo(location: string) {
        this.config.player.location = this.config.rooms[location];
    }
}
