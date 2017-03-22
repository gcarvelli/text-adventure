import "mocha";
import { assert } from "chai";

import { DummParser } from "../../src/Parse/DummParser";
import { IParser, Command, CommandType } from "../../src/Parse/IParser";

describe("DummParser", () => {
    let parser: IParser;

    let registerCommandTest = (commandString: string, commandType: CommandType, args: string[]) => {
        it("input: '" + commandString + "'", () => {
            let command = parser.Parse(commandString);
            assert.equal(commandType, command.commandType);
            if (args) {
                assert.deepEqual(args, command.args);
            }
        });
    };
    let registerCommandTests = (commands: string[], commandType: CommandType) => {
        commands.forEach((command) => {
            registerCommandTest(command, commandType, null);
        });
    };
    let registerThingTest = (command: string, commandType: CommandType) => {
        registerCommandTest(command + " thing", commandType, ["thing"]);
        registerCommandTest(command + " the thing", commandType, ["thing"]);
        registerCommandTest(command + " a thing", commandType, ["thing"]);
        registerCommandTest(command + " an thing", commandType, ["thing"]);
        registerCommandTest(command + " big thing", commandType, ["big thing"]);
        registerCommandTest(command + " the big thing", commandType, ["big thing"]);
        registerCommandTest(command + " a big thing", commandType, ["big thing"]);
        registerCommandTest(command + " an big thing", commandType, ["big thing"]);
    }

    beforeEach(() => {
        parser = new DummParser();
    });

    describe("CommandType.Empty", () => {
        registerCommandTests(["", "   "], CommandType.Empty);
    });

    describe("CommandType.LookAt", () => {
        registerCommandTests(["look at", "  look   at  "], CommandType.LookAt);
        registerThingTest("look at", CommandType.LookAt);
    });

    describe("CommandType.Look", () => {
        registerCommandTests(["look", "l", "clear"], CommandType.LookAround);
    });

    describe("CommandType.Inventory", () => {
        registerCommandTests(["inventory", "i"], CommandType.Inventory);
    });

    describe("CommandType.Move", () => {
        registerCommandTest("n", CommandType.Move, ["north"]);
        registerCommandTest("north", CommandType.Move, ["north"]);
        registerCommandTest("s", CommandType.Move, ["south"]);
        registerCommandTest("south", CommandType.Move, ["south"]);
        registerCommandTest("e", CommandType.Move, ["east"]);
        registerCommandTest("east", CommandType.Move, ["east"]);
        registerCommandTest("w", CommandType.Move, ["west"]);
        registerCommandTest("west", CommandType.Move, ["west"]);
    });

    describe("CommandType.TakeItem", () => {
        registerCommandTests(["take", "  take  "], CommandType.TakeItem);
        registerThingTest("take", CommandType.TakeItem);
    });

    describe("CommandType.DropItem", () => {
        registerCommandTests(["drop", "  drop  "], CommandType.DropItem);
        registerThingTest("drop", CommandType.DropItem);
    });

    describe("CommandType.Open", () => {
        registerCommandTests(["open", "  open  "], CommandType.Open);
        registerThingTest("open", CommandType.Open);
    });

    describe("CommandType.Close", () => {
        registerCommandTests(["close", "  close  "], CommandType.Close);
        registerThingTest("close", CommandType.Close);
    });

    describe("CommandType.TalkTo", () => {
        registerCommandTests(["talk to", "  talk      to  "], CommandType.TalkTo);
        registerThingTest("talk to", CommandType.TalkTo);
    });

    describe("CommandType.DialogOption", () => {
        registerCommandTests(["1", "2", "123", "  1  "], CommandType.Number);
    });

    describe("CommandType.Help", () => {
        registerCommandTests(["help", "  help  "], CommandType.Help);
    });
});
