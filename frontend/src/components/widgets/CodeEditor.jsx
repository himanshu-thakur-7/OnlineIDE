import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedFileAtom } from "../../recoil/atoms/selectedFileAtom";

const types = {
    "js": "javascript",
    "py": "python",
    "json": "json"
}


const CodeEditor = () => {
    const monaco = useMonaco();
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);
    const selectedFile = useRecoilValue(selectedFileAtom);
    console.log(`File in editor : ${selectedFile}`)
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
    return <div className="">
        <div className="text-m border-1 w-1/4">
            {selectedFile}
        </div>
        <Editor
            height="100vh"
            language={types[selectedFile.split('.').splice(-1)]}
            theme={isThemeLoaded ? "Blackboard" : "dark"}
            value={selectedFile === '' ? code : selectedFile}
            options={{
                inlineSuggest: true,
                fontSize: 18,
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: { enabled: false }

            }}
        />
    </div>
}

export default CodeEditor; 