import { ExecutionStrategy } from "./ExecutionStrategy";
import { Command, CommandType } from "../Parse/IParser";
import { Config } from "../Configuration/Config";
import { Output, EngineMode } from "./Engine";
import { Item } from "../Models/Models";
import { GameState } from "../Models/Simple";
import * as Utilities from "../Utilities/Utilities";
import { PrintUtilities } from "../Utilities/PrintUtilities";
import { ConditionChecker } from "../Events/ConditionChecker";
import { EventType } from "../Events/Event";

export class ExploreStrategy extends ExecutionStrategy {
    config: Config;
    out: Output;
    state: GameState;
    checker: ConditionChecker;

    constructor(config: Config, state: GameState, out: Output) {
        super(config, state, out);
        this.checker = new ConditionChecker(config, out);
    }

    public Execute(command: Command): EngineMode {
        let mode = EngineMode.Explore;

        switch (command.commandType) {
            case CommandType.LookAround:
                PrintUtilities.LookAround(this.config, this.out);
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
                        this.out.Print(item.GetLookAtDescription());
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
                    this.out.Print("\tThere doesn't seem to be anything here.");
                }
                break;

            case CommandType.Move:
                if (this.config.player.location.moves.hasOwnProperty(command.args[0])) {
                    this.MoveTo(this.config.player.location.moves[command.args[0]]);
                    PrintUtilities.LookAround(this.config, this.out);
                    break;
                }

                let door = this.config.player.location.items.filter(i => i.door.isDoor && i.door.isOpen &&
                    i.door.movement.hasOwnProperty(command.args[0]));
                if (door.length > 0) {
                    this.MoveTo(door[0].door.movement[command.args[0]]);
                    PrintUtilities.LookAround(this.config, this.out);
                    break;
                }

                this.out.Print("You can't go that way right now.");
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
                                this.out.Print("Took the " + item.name + ".");
                            }
                        } else {
                            this.out.Print("That can't be taken.")
                        }
                    } else {
                        this.out.Print("Doesn't look like there's one of those around.");
                    }
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
                            mode = EngineMode.Dialog;
                            this.state.talkingTo = npc;
                            PrintUtilities.PrintDialogTree(this.config, this.out, npc);
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
                this.out.Print("Sorry, I didn't understand that.");
                break;

            case CommandType.Empty:
                break;

            default:
                this.out.Print("Well shucks, looks like I can't do that yet.");
                break;
        }
        if (command.commandType != CommandType.Empty) {
            this.out.Print(" ");
        }
        return mode;
    }

    private MoveTo(location: string) {
        this.config.player.location = this.config.rooms[location];
    }
}
