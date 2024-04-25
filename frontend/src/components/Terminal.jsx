import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const terminalRef = useRef(null);

    useEffect(() => {
        terminalRef.current.focus();
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        // Handle input and produce output here
        setOutput(`$ ${input}\nOutput for ${input}`);
        setInput('');
    };

    return (
        <div className="bg-black text-white h-screen">
            <pre className="p-4">
                {output}
                <span className="invisible">_</span>
            </pre>
            <form onSubmit={handleInputSubmit} className="p-4">
                <span className="text-green-400">$</span>
                <input
                    ref={terminalRef}
                    className="bg-black text-white outline-none border-none ml-2"
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                />
            </form>
        </div>
    );
};

export default Terminal;
