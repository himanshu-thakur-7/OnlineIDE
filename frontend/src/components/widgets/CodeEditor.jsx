import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedFileAtom } from "../../recoil/atoms/selectedFileAtom";
import _ from "lodash";

const types = {
    "js": "javascript",
    "py": "python",
    "json": "json"
}


const CodeEditor = () => {
    const monaco = useMonaco();
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);
    const selectedFile = useRecoilValue(selectedFileAtom);
    console.log(`File in editor : ${JSON.stringify(selectedFile)}`)
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
    const updateFileContent = (data)=>{
        console.log(data)
    }
    return <div className="">
        <div className="text-m border-1 w-1/4">
            {selectedFile['name']}
        </div>
        <Editor
            onChange={updateFileContent}
            height="100vh"
            language={_.isEmpty(selectedFile) ? 'text' : types[selectedFile['name'].split('.').splice(-1)]}
            theme={isThemeLoaded ? "Blackboard" : "dark"}
            value={_.isEmpty(selectedFile) ? code : selectedFile['content']}
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