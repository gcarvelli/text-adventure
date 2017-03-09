import "mocha";
import { assert } from "chai";

import { Room, Item } from "../../src/Models/Models";
import { NPCDialog } from "../../src/Models/Dialog";

describe("Room", () => {
    let room: Room;
    let item: Item;

    let assertRoomDescriptionContains = (room: Room, contains: string[]) => {
        contains.forEach((term) => {
            let found = false;
            assert(room.GetDescription().filter((line) => line.indexOf(term) != -1).length > 0);
        });
    }

    beforeEach(() => {
        room = new Room();
        room.description = "description";

        item = new Item();
        item.name = "item name";
    });

    describe("Room.GetDescription", () => {
        it("shows room description", () => {
            assertRoomDescriptionContains(room, [ room.description ]);
        });

        describe("takeable items", () => {
            it("shows basic descriptions", () => {
                item.take.canTake = true;
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.name ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.name) != -1);
            });

            it("shows custom descriptions", () => {
                item.descriptionForRoom = "for room";
                item.take.canTake = true;
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.descriptionForRoom ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.descriptionForRoom) != -1);
            });

            it("shows dropped descriptions", () => {
                item.descriptionForRoom = "for room";
                item.take.canTake = true;
                item.take.wasDropped = true;
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.name ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.name) != -1);
                assert.isFalse(description[1].indexOf(item.descriptionForRoom) != -1)
            });
        });

        describe("doors", () => {
            it("shows closed door item descriptions", () => {
                item.descriptionForRoom = "for room";
                item.door.isDoor = true;
                item.door.isOpen = false;
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.name, "closed" ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.name) != -1);
                assert(description[1].indexOf("closed") != -1);
            });

            it("shows open door item descriptions", () => {
                item.descriptionForRoom = "for room";
                item.door.isDoor = true;
                item.door.isOpen = true;
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.name, "open" ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.name) != -1);
                assert(description[1].indexOf("open") != -1);
            });
        });

        describe("npcs", () => {
            it("shows basic descriptions", () => {
                item.npc.dialog = new NPCDialog();
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.name ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.name) != -1);
            });

            it("shows custom descriptions", () => {
                item.descriptionForRoom = "for room";
                item.npc.dialog = new NPCDialog();
                room.items.push(item);
                assertRoomDescriptionContains(room, [ room.description, item.descriptionForRoom ]);

                let description = room.GetDescription();
                assert(description.length > 1);
                assert(description[1].indexOf(item.descriptionForRoom) != -1);
            });
        });
    });
});
