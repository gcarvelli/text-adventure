import "mocha";
import { assert } from "chai";

import { Generator } from "../Generator";
import { Config } from "../../src/Configuration/Config";
import { JSONLoader } from "../../src/Configuration/JSONLoader";


describe("JSONLoader", () => {
    let config: Config;
    let data: any;

    beforeEach(() => {
        config = null;
        data = { };
        data.game = { };
        data.help = [ ];
        data.player = { };
        data.rooms = { };
        data.items = { };
        data.npcs = { };
        data.dialog_trees = { };
        data.dialog_options = { };
    });

    let Load = function() {
        let loader = new JSONLoader();
        loader.Initialize(data);
        config = loader.LoadConfig();
    }

    describe("Game", () => {
        it("loads game name and version", () => {
            data.game.name = "game name";
            data.game.version = "game version";

            Load();

            assert.equal(config.game.name, data.game.name);
            assert.equal(config.game.version, data.game.version);
        });
    });

    describe("Help", () => {
        it("loads help", () => {
            data.help = [ "line 1", "line 2" ];

            Load();

            assert.equal(config.help.length, data.help.length);
            for (let i = 0; i < config.help.length; i++) {
                assert.equal(config.help[i], data.help[i]);
            }
        });

        it("loads missing help", () => {
            data.help = undefined;
            Load();
        });
    });

    describe("Player", () => {
        it("loads missing inventory", () => {
            Load();
        });

        it("loads empty inventory", () => {
            data.player.items = [ ];
            Load();
        });

        it("loads items in inventory", () => {
            let itemData = Generator.NewItemData();
            data.items[itemData.id] = itemData;
            data.player.items = [ itemData.id ];

            Load();

            assert.equal(config.player.inventory.length, 1);
            assert.equal(config.player.inventory[0].id, itemData.id);
        });
    });

    describe("Items", () => {
        it("loads basic item", () => {
            let itemData = Generator.NewItemData();
            data.items[itemData.id] = itemData;

            Load();

            assert.isNotNull(config.items[itemData.id]);
            assert.equal(config.items[itemData.id].id, itemData.id);
            assert.equal(config.items[itemData.id].name, itemData.name);
            assert.equal(config.items[itemData.id].description, itemData.description);
        });

        it("loads item with take", () => {
            let itemData = Generator.NewItemData();
            itemData.take = {
                can_take: true
            };
            data.items[itemData.id] = itemData;

            Load();

            assert.isNotNull(config.items[itemData.id]);
            assert.isNotNull(config.items[itemData.id].take);
            assert.isTrue(config.items[itemData.id].take.canTake);
        });

        it("loads item with open (and lock)", () => {
            let contentData = Generator.NewItemData();
            data.items[contentData.id] = contentData;

            let itemData = Generator.NewItemData();
            itemData.open = {
                can_open: true,
                contains_items: [ contentData.id ],
                lock: {
                    can_lock: true,
                    key_id: Generator.RandomString()
                }
            };
            data.items[itemData.id] = itemData;

            Load();

            let item = config.items[itemData.id];
            assert.isNotNull(item);
            assert.isNotNull(item.open);
            assert.isTrue(item.open.canOpen);

            assert.isNotNull(item.open.contents);
            assert.isArray(item.open.contents);
            assert.equal(item.open.contents.length, 1);
            assert.equal(item.open.contents[0].id, contentData.id);

            assert.isNotNull(item.open.lock);
            assert.isTrue(item.open.lock.canLock);
            assert.equal(item.open.lock.keyId, itemData.open.lock.key_id);
        });

        it("loads item with weapon", () => {
            let itemData = Generator.NewItemData();
            itemData.weapon = {
                "is_weapon": true,
                "base_damage": 5,
                "damage_spread": 2
            }
            data.items[itemData.id] = itemData;

            Load();

            let item = config.items[itemData.id];
            assert.isNotNull(item);
            assert.isNotNull(item.weapon);
            assert.isTrue(item.weapon.isWeapon);
            assert.equal(item.weapon.baseDamage, itemData.weapon["base_damage"]);
            assert.equal(item.weapon.damageSpread, itemData.weapon["damage_spread"]);
        });
    });
});
