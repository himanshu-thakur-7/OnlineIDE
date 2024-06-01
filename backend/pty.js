//@ts-ignore => someone fix this
const { fork } = require('node-pty');
const path = require("path");

const SHELL = "bash";

class TerminalManager {
    sessions = {};

    constructor() {
        this.sessions = {};
    }

    createPty(id, replId, onData) {
        let term = fork(SHELL, [], {
            cols: 30,
            rows: 24,
            name: 'xterm',
            cwd: path.join(process.cwd(), `../tmp/${replId}`)
        });

        term.on('data', (data) => { onData(data, term.pid); console.log(data) });
        this.sessions[id] = {
            terminal: term,
            replId
        };
        term.on('exit', () => {
            delete this.sessions[term.pid];
        });
        return term;
    }

    write(terminalId, data) {
        this.sessions[terminalId]?.terminal.write(data);
    }

    clear(terminalId) {
        this.sessions[terminalId].terminal.kill();
        delete this.sessions[terminalId];
    }
}

module.exports = { TerminalManager }