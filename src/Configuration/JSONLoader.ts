import { ILoader } from "./ILoader";
import { Config } from "./Config";
import { Game, Player, Item, Room, NPCDialog } from "../Models/Models";
import { DialogOption, DialogTree } from "../Models/Dialog";
import { Effect } from "../Events/Effects";
import * as Effects from "../Events/Effects";

export class JSONLoader implements ILoader {
    data: any;
    config: Config;

    public Initialize(data: any) {
        this.data = data;
    }

    public LoadConfig(): Config {
        this.config = new Config();

        this.LoadGame();
        this.LoadItems();
        this.LoadPlayer();
        this.LoadRooms();
        this.LoadDialogOptions();
        this.LoadDialogTrees();
        this.LoadHelp();

        // Set player start room
        this.config.player.location = this.config.rooms[this.data.rooms.startroom];

        return this.config;
    }

    private LoadGame() {
        this.config.game.name = this.data.game.name;
        this.config.game.version = this.data.game.version;
    }

    private LoadPlayer() {
        if (this.data.player.items) {
            this.data.player.items.forEach(itemId => {
                this.config.player.inventory.push(this.config.items[itemId]);
            });
        }
    }

    private LoadRooms() {
        for (let roomId in this.data.rooms.roomlist) {
            if (this.data.rooms.roomlist.hasOwnProperty(roomId)) {
                let room = this.LoadRoom(roomId);
                this.config.rooms[roomId] = room;
            }
        }
    }

    private LoadHelp() {
        if (this.data.help && this.data.help.intro) {
            this.config.help.push(this.data.help.intro);
        }
        this.config.help.push("  look                   Show the description of the current location.");
        this.config.help.push("  look at <object>       Show the description of the <thing>.");
        this.config.help.push("  north/south/east/west  Move in that direction.");
        this.config.help.push("  inventory              List the items in your inventory.");
        this.config.help.push("  take/drop <object>     Add or remove an item to your inventory.");
        this.config.help.push("  open/close <object>    Open or close an object.");
        this.config.help.push("  talk to <person>       Attempt conversation with an NPC.");
        if (this.data.help && this.data.help.extra_lines) {
            this.data.help.extra_lines.forEach((line) => {
                this.config.help.push(line);
            });
        }
    }

    private LoadItems() {
        // Load in all the items
        for (let itemId in this.data.items) {
            if (this.data.items.hasOwnProperty(itemId)) {
                this.config.items[itemId] = this.LoadItem(itemId, this.data.items[itemId]);
            }
        }
        // Load in all the npcs
        for (let npcId in this.data.npcs) {
            if (this.data.npcs.hasOwnProperty(npcId)) {
                this.config.items[npcId] = this.LoadItem(npcId, this.data.npcs[npcId]);
            }
        }

        for (let itemId in this.config.items) {
            let item = this.config.items[itemId];
            let itemData = this.data.items[itemId] ? this.data.items[itemId] : this.data.npcs[itemId];

            // Make connections for items inside other items
            if (this.config.items.hasOwnProperty(itemId)) {
                if (item.open.canOpen && itemData.open.contains_items) {
                    itemData.open.contains_items.forEach(contentId => {
                        item.open.contents.push(this.config.items[contentId]);
                    });
                }
            }

            // Make connections for subItems
            if (itemData.items) {
                itemData.items.forEach(subItemId => {
                    item.subItems.push(this.config.items[subItemId]);
                });
            }
        }
    }

    private LoadRoom(id: string): Room {
        let room = new Room();
        let roomData = this.data.rooms.roomlist[id];

        room.id = roomData.id;
        room.name = roomData.name;
        room.description = roomData.description;

        if (roomData.items) {
            roomData.items.forEach(item => {
                room.items.push(this.config.items[item]);
            });
        }

        if (roomData.npcs) {
            roomData.npcs.forEach(npc => {
                room.items.push(this.config.items[npc]);
            });
        }

        if (roomData.basic_items) {
            roomData.basic_items.forEach(name => {
                let item = new Item();
                item.name = name;
                item.keywords = [ name ];
                room.items.push(item);
            });
        }

        if (roomData.moves) {
            // Read all the moves from the dictionary
            for (var move in roomData.moves) {
                if (roomData.moves.hasOwnProperty(move)) {
                    room.moves[move] = roomData.moves[move];
                }
            }
        }

        return room;
    }

    private LoadItem(id: string, itemData: any): Item {
        let item = new Item();

        item.id = id;
        this.LoadItemInto(item, itemData);

        return item;
    }

    private LoadItemInto(item: Item, itemData: any): void {
        item.keywords = itemData.keywords ? itemData.keywords : [ item.id.toLowerCase() ];
        item.name = itemData.name ? itemData.name : item.keywords[0];
        item.description = itemData.description;
        item.descriptionForRoom = itemData.description_for_room;

        if (itemData.take) {
            item.take.canTake = itemData.take.can_take;
        }
        if (itemData.open) {
            item.open.canOpen = itemData.open.can_open;
            if (itemData.open.lock) {
                item.open.lock.canLock = itemData.open.lock.can_lock;
                item.open.lock.keyId = itemData.open.lock.key_id;
                item.open.lock.isLocked = true;
            }
        }
        if (itemData.npc) {
            if (itemData.npc.dialog) {
                item.npc.dialog = new NPCDialog();
                item.npc.dialog.greeting = itemData.npc.dialog.greeting;
                item.npc.dialog.startTree = itemData.npc.dialog.start_tree;
            }
        }
        if (itemData.door) {
            item.door.isDoor = itemData.door.is_door;
            item.door.movement = itemData.door.moves;
            if (itemData.door.lock) {
                item.door.lock.canLock = itemData.door.lock.can_lock;
                item.door.lock.keyId = itemData.door.lock.key_id;
                item.door.lock.isLocked = true;
            }
        }

        if (itemData.basic_items) {
            itemData.basic_items.forEach(name => {
                let subItem = new Item();
                subItem.name = name;
                subItem.keywords = [ name ];
                item.subItems.push(subItem);
            });
        }
    }

    private LoadDialogOptions() {
        if (this.data.dialog_options) {
            // Load in all the dialog options
            for (let dialogOptionId in this.data.dialog_options) {
                if (this.data.dialog_options.hasOwnProperty(dialogOptionId)) {
                    this.config.dialogOptions[dialogOptionId] = this.LoadDialogOption(dialogOptionId, this.data.dialog_options[dialogOptionId]);
                }
            }
        }
    }

    private LoadDialogOption(id: string, optionData: any) : DialogOption {
        let option = new DialogOption();
        option.id = id;
        option.choice = optionData.choice;
        option.response = optionData.response;
        return option;
    }

    private LoadDialogTrees() {
        if (this.data.dialog_trees) {
            for (let dialogTreeId in this.data.dialog_trees) {
                if (this.data.dialog_trees.hasOwnProperty(dialogTreeId)) {
                    let tree = new DialogTree();
                    let treeData = this.data.dialog_trees[dialogTreeId];
                    tree.id = dialogTreeId;
                    treeData.forEach(optionData => {
                        tree.options.push(this.config.dialogOptions[optionData]);
                    });
                    this.config.dialogTrees[tree.id] = tree;
                }
            }
        }
    }

    private LoadEffect(effectData: any): Effect {
        switch (effectData.type) {
            case "change_name":
                return new Effects.ChangeNameEffect(this.config, effectData.target_item, effectData.name);
            case "change_description_for_room":
                return new Effects.ChangeDescriptionForRoomEffect(this.config, effectData.target_item,
                    effectData.description_for_room);
            case "add_item_to_inventory":
                return new Effects.AddItemToInventoryEffect(this.config, effectData.item);
            case "add_keywords_to_item":
                return new Effects.AddKeywordToItemEffect(this.config, effectData.target_item, effectData.keywords);
        }
        throw new TypeError("Effect type " + effectData.type + " not found!");
    }
}
