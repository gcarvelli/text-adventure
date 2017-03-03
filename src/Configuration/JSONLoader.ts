import { ILoader } from "./ILoader";
import { Config } from "./Config";
import { Game, Item, Player, Room, RoomMap, NPC } from "../Models/Models";
import { DialogTreeMap, DialogTree, DialogOption, NPCDialog } from "../Models/Dialog";
import { Effect } from "../Models/Effects";
import * as Effects from "../Models/Effects";

export class JSONLoader implements ILoader {
    data: any;
    config: Config;

    public Initialize(data: any) {
        this.data = data;
    }

    public LoadConfig(): Config {
        this.config = new Config();

        this.config.rooms = { };

        this.LoadGame();
        this.LoadItems();
        this.LoadNPCs();
        this.LoadPlayer();
        this.LoadRooms();
        this.LoadDialogTrees();
        this.LoadHelp();

        // Set player start room
        this.config.player.location = this.config.rooms[this.data.rooms.startroom];

        return this.config;
    }

    public LoadGame() {
        this.config.game = new Game();
        this.config.game.name = this.data.game.name;
        this.config.game.version = this.data.game.version;
    }

    public LoadPlayer() {
        this.config.player = new Player();
        if (this.data.player.items) {
            this.data.player.items.forEach(itemId => {
                this.config.player.inventory.push(this.config.items[itemId]);
            });
        }
    }

    public LoadRooms() {
        for (let roomId in this.data.rooms.roomlist) {
            if (this.data.rooms.roomlist.hasOwnProperty(roomId)) {
                let room = this.LoadRoom(roomId);
                this.config.rooms[roomId] = room;
            }
        }
    }

    private LoadHelp() {
        this.config.help = this.data.help;
    }

    private LoadItems() {
        // Load in all the items
        for (let itemId in this.data.items) {
            if (this.data.items.hasOwnProperty(itemId)) {
                this.config.items[itemId] = this.LoadItem(itemId);
            }
        }

        for (let itemId in this.config.items) {
            let item = this.config.items[itemId];
            let itemData = this.data.items[itemId];

            // Make connections for items inside other items
            if (this.config.items.hasOwnProperty(itemId)) {
                if (item.canOpen && itemData.contains_items) {
                    itemData.contains_items.forEach(contentId => {
                        item.contents.push(this.config.items[contentId]);
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

    private LoadNPCs() {
        for (let npcId in this.data.npcs) {
            if (this.data.npcs.hasOwnProperty(npcId)) {
                this.config.npcs[npcId] = this.LoadNPC(npcId);
            }
        }

        for (let npcId in this.config.npcs) {
            let npc = this.config.npcs[npcId];
            let npcData = this.data.npcs[npcId];

            // Make connections for items inside other items
            if (this.config.npcs.hasOwnProperty(npcId)) {
                if (npc.canOpen && npcData.contains_items) {
                    npcData.contains_items.forEach(contentId => {
                        npc.contents.push(this.config.items[contentId]);
                    });
                }
            }

            // Make connections for subItems
            if (npcData.items) {
                npcData.items.forEach(subItemId => {
                    npc.subItems.push(this.config.items[subItemId]);
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
                room.items.push(this.config.npcs[npc]);
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

    private LoadItem(id: string): Item {
        let item = new Item();
        let itemData = this.data.items[id];

        item.id = id;
        this.LoadItemInto(item, itemData);

        return item;
    }

    private LoadNPC(id: string): NPC {
        let npc = new NPC();
        let npcData = this.data.npcs[id];

        npc.id = id;
        this.LoadItemInto(npc, npcData);

        if (npcData.dialog) {
            npc.dialog = new NPCDialog();
            npc.dialog.greeting = npcData.dialog.greeting;
            npc.dialog.startTree = npcData.dialog.start_tree;
        }

        return npc;
    }

    private LoadItemInto(item: Item, itemData: any): void {
        item.keywords = itemData.keywords ? itemData.keywords.split(',') : [ item.id.toLowerCase() ];
        item.name = itemData.name ? itemData.name : item.keywords[0];
        item.description = itemData.description;
        item.descriptionForRoom = itemData.description_for_room;
        item.canTake = itemData.can_take;
        item.canOpen = itemData.can_open;

        if (itemData.basic_items) {
            itemData.basic_items.forEach(name => {
                let subItem = new Item();
                subItem.name = name;
                subItem.keywords = [ name ];
                item.subItems.push(subItem);
            });
        }
    }

    public LoadDialogTrees() {
        if (this.data.dialog_trees) {
            for (let dialogTreeId in this.data.dialog_trees) {
                if (this.data.dialog_trees.hasOwnProperty(dialogTreeId)) {
                    let tree = new DialogTree();
                    let treeData = this.data.dialog_trees[dialogTreeId];
                    tree.id = dialogTreeId;
                    treeData.forEach(optionData => {
                        tree.options.push(this.LoadDialogOption(optionData));
                    });
                    this.config.dialogTrees[tree.id] = tree;
                }
            }
        }
    }

    private LoadDialogOption(optionData: any) : DialogOption {
        let option = new DialogOption();
        option.choice = optionData.choice;
        option.response = optionData.response;
        if (optionData.effects) {
            optionData.effects.forEach(effectData => {
                option.effects.push(this.LoadEffect(effectData));
            });
        }
        return option;
    }

    private LoadEffect(effectData: any): Effect {
        switch (effectData.type) {
            case "add_dialog_option":
                return new Effects.AddDialogOptionEffect(this.config, effectData.target_tree,
                    this.LoadDialogOption(effectData.dialog_option));
            case "change_name":
                return new Effects.ChangeNameEffect(this.config, effectData.target_item, effectData.name);
            case "change_description_for_room":
                return new Effects.ChangeDescriptionForRoomEffect(this.config, effectData.target_item,
                    effectData.description_for_room);
        }
        return null;
    }
}