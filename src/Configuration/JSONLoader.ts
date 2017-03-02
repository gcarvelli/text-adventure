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
        for (let itemId in this.data.items) {
            if (this.data.items.hasOwnProperty(itemId)) {
                this.config.items[itemId] = this.LoadItem(itemId);
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
                room.items.push(this.LoadItem(item));
            });
        }

        if (roomData.npcs) {
            roomData.npcs.forEach(npc => {
                room.items.push(this.LoadNPC(npc));
            });
        }

        if (roomData.basic_items) {
            roomData.basic_items.forEach(name => {
                let item = new Item();
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
        if (item.canOpen && itemData.contains_items) {
            itemData.contains_items.forEach(contentId => {
                item.contents.push(this.LoadItem(contentId));
            });
        }
        if (itemData.basic_items) {
            itemData.basic_items.forEach(name => {
                let subItem = new Item();
                subItem.keywords = [ name ];
                item.subItems.push(subItem);
            });
        }
        if (itemData.items) {
            itemData.items.forEach(subItemId => {
                item.subItems.push(this.LoadItem(subItemId));
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
                        tree.options.push(this.LoadDialogOption(this.config, optionData));
                    });
                    this.config.dialogTrees[tree.id] = tree;
                }
            }
        }
    }

    private LoadDialogOption(config: Config, optionData: any) : DialogOption {
        let option = new DialogOption();
        option.choice = optionData.choice;
        option.response = optionData.response;
        if (optionData.effects) {
            optionData.effects.forEach(effectData => {
                option.effects.push(this.LoadEffect(config, effectData));
            });
        }
        return option;
    }

    private LoadEffect(config: Config, effectData: any): Effect {
        switch (effectData.type) {
            case "add_dialog_option":
                let effect = new Effects.AddDialogOptionEffect(config, effectData.target_tree,
                    this.LoadDialogOption(config, effectData.dialog_option));
                return effect;
        }
        return null;
    }
}