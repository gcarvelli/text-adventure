import "mocha";
import { assert } from "chai";

import { Generator } from "../Generator";
import * as Effect from "../../src/Models/Effects";
import { DialogTree, DialogOption } from "../../src/Models/Dialog";
import { Item } from "../../src/Models/Item";
import { Config } from "../../src/Configuration/Config";

describe("Effects", () => {
    let config: Config;

    beforeEach(() => {
        config = new Config();
    });

    describe("DialogOptionEffects", () => {
        let dialogTree: DialogTree;

        beforeEach(() => {
            dialogTree = new DialogTree();
            dialogTree.id = "MAIN";
            config.dialogTrees["MAIN"] = dialogTree;
        });

        describe("AddDialogOptionEffect", () => {
            let effect: Effect.AddDialogOptionEffect;
            let dialogOption: DialogOption;

            beforeEach(() => {
                dialogOption = new DialogOption();
                dialogOption.id = "DIALOG_OPTION";
                config.dialogOptions[dialogOption.id] = dialogOption;
                effect = new Effect.AddDialogOptionEffect(config, dialogTree.id, dialogOption.id, null);
            });
            
            it("add a dialog option", () => {
                effect.Execute();
                assert.equal(1, dialogTree.options.length);
                assert.equal(dialogOption.id, dialogTree.options[0].id);
            });

            it("don't re-add an existing dialog option", () => {
                dialogTree.options.push(dialogOption);
                effect.Execute();
                assert.equal(1, dialogTree.options.length);
                assert.equal(dialogOption.id, dialogTree.options[0].id);
            });

            it("add after an existing dialog option", () => {
                let dialogOption1 = new DialogOption();
                dialogOption1.id = "ID1";
                dialogTree.options.push(dialogOption1);
                let dialogOption2 = new DialogOption();
                dialogOption2.id = "ID2";
                dialogTree.options.push(dialogOption2);
                effect.afterId = dialogOption1.id;

                effect.Execute();
                assert.equal(3, dialogTree.options.length);
                assert.equal(dialogOption1.id, dialogTree.options[0].id);
                assert.equal(dialogOption.id, dialogTree.options[1].id);
                assert.equal(dialogOption2.id, dialogTree.options[2].id);
            });
        });

        describe("RemoveDialogOptionEffect", () => {
            let effect: Effect.RemoveDialogOptionEffect;
            let dialogOption: DialogOption;

            beforeEach(() => {
                dialogOption = new DialogOption();
                dialogOption.id = "ID";
                effect = new Effect.RemoveDialogOptionEffect(config, dialogTree.id, dialogOption.id);
            });

            it("remove dialog option", () => {
                dialogTree.options.push(dialogOption);
                effect.Execute();
                assert.equal(0, dialogTree.options.length);
            });

            it("remove only one dialog option", () => {
                let option1 = new DialogOption();
                option1.id = "id1";
                let option2 = new DialogOption();
                option2.id =  "id2";

                dialogTree.options.push(option1);
                dialogTree.options.push(dialogOption);
                dialogTree.options.push(option2);

                effect.Execute();
                assert.equal(2, dialogTree.options.length);
                assert.equal(option1.id, dialogTree.options[0].id);
                assert.equal(option2.id, dialogTree.options[1].id);
            });
        });
    });

    describe("ItemChangeEffects", () => {
        let item: Item;

        beforeEach(() => {
            item = Generator.NewItem();
            config.items[item.id] = item;
        });

        describe("ChangeNameEffect", () => {
            let effect: Effect.ChangeNameEffect;

            beforeEach(() => {
                effect = new Effect.ChangeNameEffect(config, item.id, item.name + "extra");
            });

            it("change name", () => {
                let oldName = item.name;
                effect.Execute();
                assert.notEqual(oldName, item.name);
                assert.equal(effect.newName, item.name);
            });
        });

        describe("ChangeDescriptionForRoomEffect", () => {
            let effect: Effect.ChangeDescriptionForRoomEffect;

            beforeEach(() => {
                effect = new Effect.ChangeDescriptionForRoomEffect(config, item.id, item.descriptionForRoom + "extra");
            });

            it("change description for room", () => {
                let oldDesc = item.description;
                effect.Execute();
                assert.notEqual(oldDesc, item.descriptionForRoom);
                assert.equal(effect.newDescription, item.descriptionForRoom);
            });
        });

        describe("AddItemToInventoryEffect", () => {
            let effect: Effect.AddItemToInventoryEffect;

            beforeEach(() => {
                effect = new Effect.AddItemToInventoryEffect(config, item.id);
            });

            it("add item to inventory", () => {
                assert.equal(-1, config.player.inventory.indexOf(config.items[item.id]));
                effect.Execute();
                assert.notEqual(-1, config.player.inventory.indexOf(config.items[item.id]));
            });
        });

        describe("AddKeywordToItemEffect", () => {
            let effect: Effect.AddKeywordToItemEffect;

            beforeEach(() => {
                effect = new Effect.AddKeywordToItemEffect(config, item.id, [ "new keyword 1", "new keyword 2" ]);
            });

            it("add keyword to item", () => {
                assert.equal(-1, item.keywords.indexOf(effect.keywords[0]));
                assert.equal(-1, item.keywords.indexOf(effect.keywords[1]));
                effect.Execute();
                assert.notEqual(-1, item.keywords.indexOf(effect.keywords[0]));
                assert.notEqual(-1, item.keywords.indexOf(effect.keywords[1]));
            });
        });
    });
});
