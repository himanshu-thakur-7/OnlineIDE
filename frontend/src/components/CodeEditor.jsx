import React from 'react';
import MonacoEditor from 'react-monaco-editor';

const CodeEditor = () => {
    const editorDidMount = (editor, monaco) => {
        console.log('editorDidMount', editor);
        editor.focus();
    };

    return (
        <MonacoEditor
            height="100vh"
            language="javascript"
            theme="vs-dark"
            editorDidMount={editorDidMount}
        />
    );
};

export default CodeEditor;
