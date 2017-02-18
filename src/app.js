require('keyboardevent-key-polyfill').polyfill();

import { Engine } from "./Engine";
import * as data from "../Game.json";
import { DummParser } from "./Parse/DummParser";

let engine = new Engine();

let terminal = $('#term').terminal(function(commandString) {
    engine.Execute(commandString);
}, {
    clear: false
});

let out = {
    Print: function(output) {
        terminal.echo(output);
    },
    Clear: function() {
        terminal.clear();
    }
}

engine.Initialize(data, out, new DummParser());
