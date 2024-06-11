import { useEffect, useRef } from "react"
import { Terminal } from "xterm";
import './xterm.css';
import { FitAddon } from 'xterm-addon-fit';


const OPTIONS_TERM = {
    useStyle: true,
    screenKeys: true,
    cursorBlink: true,
    cols: 800,
    rows: 26,
    theme: {
        background: "black"
    }
};
const TerminalComponent = ({ socket }) => {
    const terminalRef = useRef(null);
    const fitAddon = new FitAddon();
   
    useEffect(() => {


        const terminal = new Terminal(OPTIONS_TERM);
        console.log("terminal loaded line 73")
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        fitAddon.fit();

        socket.on('output', (data) => {
            terminal.write(data);
        });

        terminal.onData((data) => {
            socket.emit('terminalInput', data);
        });

    }, [])


    return <div className=" w-screen*0.9 h-1/2" style={{ textAlign: "left", backgroundColor: "#000", paddingBottom: 220 }} ref={terminalRef}>

    </div>
}

export default TerminalComponent;