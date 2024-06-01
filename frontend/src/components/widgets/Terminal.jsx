import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import './xterm.css';
import { FitAddon } from 'xterm-addon-fit';
const fitAddon = new FitAddon();

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

const OPTIONS_TERM = {
    useStyle: true,
    screenKeys: true,
    cursorBlink: true,
    cols: 200,
    rows: 26,
    theme: {
        background: "black"
    }
};
const TerminalComponent = ({ socket }) => {
    const terminalRef = useRef(null);
    const fitAddon = new FitAddon();
    // const terminalHandler = ({ data }) => {
    //     console.log("terminal handler line 38")
    //     console.log(data);
    //     if (data instanceof ArrayBuffer) {
    //         console.error(data);
    //         console.log(ab2str(data))
    //         term.write(ab2str(data))
    //     }
    // }
    // const t = (data) => {
    //     console.log(data)
    // }

    // useEffect(() => {
    //     console.log("Terminal Loaded!")
    //     if (!terminalRef || !terminalRef.current || !socket) {
    //         console.log('Terminal not loaded', terminalRef.current, socket)
    //         return;
    //     }

    //     socket.emit("requestTerminal");
    //     socket.on("terminal", t)
    //     // console.log(terminalHandler);
    //     const term = new Terminal(OPTIONS_TERM)
    //     term.loadAddon(fitAddon);
    //     term.open(terminalRef.current);
    //     fitAddon.fit();


    //     term.onData((data) => {
    //         console.log(data);
    //         socket.emit('terminalData', {
    //             data
    //         });
    //     });

    //     socket.emit('terminalData', {
    //         data: '\n'
    //     });

    //     return () => {
    //         socket.off("terminal")
    //     }
    // }, [terminalRef]);

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

        // const handleResize = () => {
        //     fitAddon.fit();
        //     socket.emit('resize', { cols: terminal.cols, rows: terminal.rows });
        // };

        // window.addEventListener('resize', handleResize);

        // return () => {
        //     window.removeEventListener('resize', handleResize);
        //     socket.disconnect();
        // };
    }, [])


    return <div className=" w-screen*0.9 h-5/6" style={{ textAlign: "left", backgroundColor: "#000", paddingBottom: 220 }} ref={terminalRef}>

    </div>
}

export default TerminalComponent;