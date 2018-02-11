const repl = require('repl');

import * as data from "../House_Explorer.json";
import { Engine } from "./Engine/Engine";
import { DummParser } from "./Parse/DummParser";
import { JSONLoader } from "./Configuration/JSONLoader";

// Hook up terminal and engine
let engine = new Engine();

repl.start({prompt: '', eval: function(cmd, context, filename, callback) {
    engine.Execute(cmd)
}});

let out = {
    Print: function(output) {
        console.log(output);
    },
    PrintLines: function(lines) {
        lines.forEach(function(line) {
            console.log(line);
        });
    },
    Clear: function() {
        console.log('\x1Bc');
    }
};

let loader = new JSONLoader();
loader.Initialize(data);
engine.Initialize(loader, out, new DummParser());
