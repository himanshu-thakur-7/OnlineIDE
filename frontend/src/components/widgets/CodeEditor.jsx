import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import debounce from 'lodash.debounce';
import _ from "lodash";
import { selectedFileAtom } from "../../recoil/atoms/selectedFileAtom";
import { fileContentsAtom } from "../../recoil/atoms/fileContentsAtom";

const types = {
    "js": "javascript",
    "py": "python",
    "json": "json",
    "css": "css",
    "md": "markdown",
    "html": "html",
    "rs": "rust",
    "go": "go",
    "ts": "typescript"
}

const CodeEditor = ({ socket }) => {
    const monaco = useMonaco();
    const [isThemeLoaded, setIsThemeLoaded] = useState(false);
    const selectedFile = useRecoilValue(selectedFileAtom);
    const [files, setFileContents] = useRecoilState(fileContentsAtom);

    useEffect(() => {
        if (monaco) {
            import('monaco-themes/themes/Dracula.json')
                .then(data => {
                    data.colors["editor.background"] = "#15323d";
                    monaco.editor.defineTheme('Blackboard', data);
                    setIsThemeLoaded(true);
                });
        }
    }, [monaco]);

    useEffect(() => {
        console.log("Fetching")
        if (selectedFile['path']) {
            socket?.emit("fetchContent", { path: selectedFile['path'] }, (data) => {
                setFileContents(content => ({ ...content, [selectedFile['path']]: data }));
            });
        }
    }, [selectedFile, setFileContents, socket]);

    const updateFileContent = useCallback(
        debounce((data) => {
            console.log(data);
            setFileContents(content => ({ ...content, [selectedFile['path']]: data }));
            socket?.emit("updateContent", { path: selectedFile['path'], content: data });
        }, 800),
        [selectedFile['path'], setFileContents]
    );

    return (
        <div className="">
            <div className="text-m border-1 w-1/4">
                {selectedFile['name']}
            </div>
            <Editor
                onChange={updateFileContent}
                height="100vh"
                language={_.isEmpty(selectedFile) ? 'javascript' : types[selectedFile['path'].split('.').pop()]}
                theme={isThemeLoaded ? "Blackboard" : "dark"}
                value={files[selectedFile['path']] || ""}
                options={{
                    inlineSuggest: true,
                    fontSize: 18,
                    formatOnType: true,
                    autoClosingBrackets: true,
                    minimap: { enabled: false }
                }}
            />
        </div>
    );
}

export default CodeEditor;
