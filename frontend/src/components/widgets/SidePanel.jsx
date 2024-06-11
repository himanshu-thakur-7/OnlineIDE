import React, { useState, useLayoutEffect, useEffect } from "react";
import Tree from "./Tree/Tree";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedFileAtom } from "../../recoil/atoms/selectedFileAtom";
import { projectFilesAtom } from "../../recoil/atoms/projectFilesAtom";


const SidePanel = ({ socket }) => {
    let [_data, setProjectFiles] = useRecoilState(projectFilesAtom);
    const data = useRecoilValue(projectFilesAtom);
    const [_, setSelectedFile] = useRecoilState(selectedFileAtom);
    const selectedFile = useRecoilValue(selectedFileAtom);


    useLayoutEffect(() => {
        socket.on('loaded', (files) => {
            const fetchedFiles = files["rootContent"].filter((d) => d !== null)
            console.log("Files: ", files['rootContent']);
            console.log('Loaded event')
            setProjectFiles(fetchedFiles);
            console.log(data);
        })
    }, [])

    console.log(`Side Panel Data: ${JSON.stringify(data)}`)

    const handleClick = async (node) => {
        if (node['node']['type'] === "file" && node['node']['path'] !== selectedFile['path']) {
            console.log(JSON.stringify(node['node']['path']))

            setSelectedFile({ 'path': node['node']['path'], 'name': node['node']['name'] });
            console.log(`Side Panel 78: ${JSON.stringify(selectedFile)}`)


            console.log(selectedFileAtom);
            console.log(node);

        }
        if (node['node']['type'] === 'folder') {
            console.log(node['node']['path'])
            if (!node['node']['content']) {
                socket?.emit("fetchDir", { path: node['node']['path'] }, (data) => {
                    let updatedFiles = [..._data].map((item) => {
                        if (item.path === node['node']['path']) return { ...item, files: data, content: true };
                        else return item;
                    });

                    setProjectFiles(updatedFiles);
                    console.log(data);
                });
            }
            // fetch files for this folder and save it in its files array
        }
    };
    const handleUpdate = (state) => {
        // TODO: Function to handle file name changes / creation / deletion 
        console.log(state);
    };


    return <div>
        {
            data ? <Tree data={data} onUpdate={handleUpdate} onNodeClick={handleClick} /> : <div>Waiting for data</div>
        }

    </div>
}

export default SidePanel; 