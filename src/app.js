require('keyboardevent-key-polyfill').polyfill();

import * as data from "../Game.json";
import { Engine } from "./Engine";
import { DummParser } from "./Parse/DummParser";
import { JSONLoader } from "./Configuration/JSONLoader";

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

engine.Initialize(new JSONLoader(data), out, new DummParser());
