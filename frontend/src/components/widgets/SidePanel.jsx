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
            // console.log(files['rootContent']);
            setProjectFiles(fetchedFiles);
            console.log(data);
        })
    }, [])

    console.log(`Side Panel Data: ${JSON.stringify(data)}`)

    const handleClick = async (node) => {
        // console.log(node['node']['type'] === 'folder')
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
                    // console.log(data)
                    // // node['node']['content'] = data;
                    let updatedFiles = [..._data].map((item) => {
                        if (item.path === node['node']['path']) return { ...item, files: data, content: true };
                        else return item;
                    });

                    setProjectFiles(updatedFiles);
                    console.log(data);
                    // setSelectedFile(file);
                });
            }
            // fetch files for this folder and save it in its files array
        }
    };
    const handleUpdate = (state) => {
        // localStorage.setItem(
        //     "tree",
        //     JSON.stringify(state, function (key, value) {
        //         if (key === "parentNode" || key === "id") {
        //             return null;
        //         }
        //         return value;
        //     })
        // );
        console.log(state);
    };

    // useLayoutEffect(() => {
    //     try {
    //         let savedStructure = JSON.parse(localStorage.getItem("tree"));
    //         if (savedStructure) {
    //             setProjectFiles(savedStructure);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }, []);
    return <div>
        {
            data ? <Tree data={data} onUpdate={handleUpdate} onNodeClick={handleClick} /> : <div>Waiting for data</div>
        }

    </div>
}

export default SidePanel; 