require('keyboardevent-key-polyfill').polyfill();

import * as data from "../House_Explorer.json";
import { Engine } from "./Engine/Engine";
import { DummParser } from "./Parse/DummParser";
import { JSONLoader } from "./Configuration/JSONLoader";

// Hook up terminal and engine
let engine = new Engine();

let terminal = $('#term').terminal(function(commandString) {
    engine.Execute(commandString);
}, {
    clear: false
});

let out = {
    Print: function(output) {
        terminal.echo(output, {
            keepWords: true
        });
    },
    PrintLines: function(lines) {
        lines.forEach(function(line) {
            terminal.echo(line, {
                keepWords: true
            });
        });
    },
    Clear: function() {
        terminal.clear();
    }
};

let loader = new JSONLoader();
loader.Initialize(data);
engine.Initialize(loader, out, new DummParser());
