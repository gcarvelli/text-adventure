import "mocha";
import { assert } from "chai";

import { Generator } from "../Generator";
import * as Effect from "../../src/Events/Effect";
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
                effect = new Effect.ChangeNameEffect(item.id, item.name + "extra");
            });

            it("change name", () => {
                let oldName = item.name;
                effect.Execute(config);
                assert.notEqual(oldName, item.name);
            });
        });

        describe("ChangeDescriptionForRoomEffect", () => {
            let effect: Effect.ChangeDescriptionForRoomEffect;

            beforeEach(() => {
                effect = new Effect.ChangeDescriptionForRoomEffect(item.id, item.descriptionForRoom + "extra");
            });

            it("change description for room", () => {
                let oldDesc = item.description;
                effect.Execute(config);
                assert.notEqual(oldDesc, item.descriptionForRoom);
            });
        });

        describe("AddItemToInventoryEffect", () => {
            let effect: Effect.AddItemToInventoryEffect;

            beforeEach(() => {
                effect = new Effect.AddItemToInventoryEffect(item.id);
            });

            it("add item to inventory", () => {
                assert.equal(-1, config.player.inventory.indexOf(config.items[item.id]));
                effect.Execute(config);
                assert.notEqual(-1, config.player.inventory.indexOf(config.items[item.id]));
            });
        });

        describe("AddKeywordToItemEffect", () => {
            let effect: Effect.AddKeywordsToItemEffect;
            let keywords = [ "new keyword 1", "new keyword 2" ];

            beforeEach(() => {
                effect = new Effect.AddKeywordsToItemEffect(item.id, keywords);
            });

            it("add keyword to item", () => {
                assert.equal(-1, item.keywords.indexOf(keywords[0]));
                assert.equal(-1, item.keywords.indexOf(keywords[1]));
                effect.Execute(config);
                assert.notEqual(-1, item.keywords.indexOf(keywords[0]));
                assert.notEqual(-1, item.keywords.indexOf(keywords[1]));
            });
        });

        describe("SetToggleToTrueEffect", () => {
            let effect: Effect.SetToggleToTrueEffect;
            let toggleId = "myToggle";

            beforeEach(() => {
                effect = new Effect.SetToggleToTrueEffect(toggleId);
            });

            it("keeps true toggle true", () => {
                config.state.toggles[toggleId] = true;
                effect.Execute(config);
                assert.isTrue(config.state.toggles[toggleId]);
            });

            it("sets false toggle to true", () => {
                config.state.toggles[toggleId] = false;
                effect.Execute(config);
                assert.isTrue(config.state.toggles[toggleId]);
            });
        });

        describe("SetToggleToFalseEffect", () => {
            let effect: Effect.SetToggleToFalseEffect;
            let toggleId = "myToggle";

            beforeEach(() => {
                effect = new Effect.SetToggleToFalseEffect(toggleId);
            });

            it("keeps false toggle false", () => {
                config.state.toggles[toggleId] = false;
                effect.Execute(config);
                assert.isFalse(config.state.toggles[toggleId]);
            });

            it("sets true toggle to false", () => {
                config.state.toggles[toggleId] = true;
                effect.Execute(config);
                assert.isFalse(config.state.toggles[toggleId]);
            });
        });
    });
});
