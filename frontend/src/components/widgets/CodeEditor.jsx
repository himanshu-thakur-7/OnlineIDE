import Editor, { useMonaco } from "@monaco-editor/react";
import themes from "monaco-themes";
import { useEffect, useState } from "react";

const myTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [{ background: 'EDF9FA' }],
};

const CodeEditor = () => {
    const monaco = useMonaco();
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);

    useEffect(() => {
        if (monaco) {
            console.log("Monaco Editor initialized");
            import('monaco-themes/themes/Dracula.json')
                .then(data => {
                    data.colors["editor.background"] = "#15323d"
                    data.colors[""]
                    console.log(data)
                    monaco.editor.defineTheme('Blackboard', data);
                    setIsThemeLoaded(true);
                })
        }
    }, [monaco])
    const code = "var message = 'monaco editor!' \nconsole.log(message);";
    return <div className=" text-6xl">
        <Editor
            height="100vh"
            language="javascript"
            theme={isThemeLoaded ? "Blackboard" : "dark"}
            value={code}
            options={{
                inlinesuggest: true,
                fontSize: 18,
                formatontype: true,
                autoclosingbrackets: true,
                // minimap: { scale: 0 }
            }}
        />
    </div>
}

export default CodeEditor; 