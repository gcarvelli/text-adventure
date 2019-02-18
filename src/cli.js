const repl = require('repl');
const process = require('process');

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
    Print: function(str) {
        process.stdout.write(str)
    },
    PrintLn: function(str) {
        console.log(str);
    },
    Clear: function() {
        console.log('\x1Bc');
    },
    GetColumns: function() {
        return 80; // TODO this could be better
    },
    ShouldWritePrompt: function() {
        return false;
    }
};

let loader = new JSONLoader();
loader.Initialize(data);
engine.Initialize(loader, out, new DummParser());
