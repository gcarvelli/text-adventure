import "mocha";
import { assert } from "chai";

import { Generator } from "../Generator";
import * as Effect from "../../src/Events/Effects";
import { DialogTree, DialogOption } from "../../src/Models/Dialog";
import { Item } from "../../src/Models/Models";
import { Config } from "../../src/Configuration/Config";

describe("Effects", () => {
    let config: Config;

    beforeEach(() => {
        config = new Config();
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
