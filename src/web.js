require('keyboardevent-key-polyfill').polyfill();

import * as data from "../House-Explorer.json";
import { Engine } from "./Engine/Engine";
import { DummParser } from "./Parse/DummParser";
import { JSONLoader } from "./Configuration/JSONLoader";
import { Terminal } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";

// Hook up terminal and engine
let engine = new Engine();

Terminal.applyAddon(fit);

// TODO figure out how to do this without demo code
let terminalContainer = document.getElementById('term');
let createTerminal = function() {
    // Clean terminal
    while (terminalContainer.children.length) {
      terminalContainer.removeChild(terminalContainer.children[0]);
    }
    term = new Terminal({});
    window.term = term;  // Expose `term` to window for debugging purposes

    term.open(terminalContainer);
    term.fit();
    term.focus();

    setTimeout(() => {
        term.fit();
    }, 0);
  }
createTerminal();
let buffer = [];
term._core.register(term.addDisposableListener('key', (key, ev) => {
    const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

    if (ev.keyCode === 13) {
        // Enter
        let commandString = buffer.join('');

        term.writeln('');
        engine.Execute(commandString);

        buffer.length = 0;
    } else if (ev.keyCode === 8) {
        // Backspace; don't delete the prompt
        if (buffer.length > 0) {
            term.write('\b \b');
            buffer.pop();
        }
    } else if (printable) {
        buffer.push(key)
        term.write(key);
    }
}));
$(document).ready(function() {
    $('#container').change(function() {
        term.fit();
    });
    term.fit();
});


let out = {
    Print: function(str) {
        term.write(str);
    },
    PrintLn: function(str) {
        term.writeln(str);
    },
    Clear: function() {
        term.clear();
        term.scrollLines(1);
    },
    GetColumns: function() {
        return term.getOption('cols');
    },
    ShouldWritePrompt: function() {
        return true;
    }
};

let loader = new JSONLoader();
loader.Initialize(data);
engine.Initialize(loader, out, new DummParser());

document.title = engine.config.game.name;
