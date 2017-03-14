import "mocha";
import { assert } from "chai";

import { Generator } from "../Generator";
import * as Effect from "../../src/Models/Effects";
import { DialogTree, DialogOption } from "../../src/Models/Dialog";
import { Item } from "../../src/Models/Models";
import { Config } from "../../src/Configuration/Config";

describe("Effects", () => {
    let config: Config;

    describe("DialogOptionEffects", () => {
        let dialogTree: DialogTree;

        beforeEach(() => {
            config = new Config();
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
                effect = new Effect.AddDialogOptionEffect(config, dialogTree.id, dialogOption, null);
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
                dialogTree.options.push(dialogOption);
                effect = new Effect.RemoveDialogOptionEffect(config, dialogTree.id, dialogOption.id);
            });

            it("remove dialog option", () => {
                effect.Execute();
                assert.equal(0, dialogTree.options.length);
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
    });
});
