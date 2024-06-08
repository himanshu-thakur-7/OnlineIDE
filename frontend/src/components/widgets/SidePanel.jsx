import React, { useState, useLayoutEffect, useEffect } from "react";
import Tree from "./Tree/Tree";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedFileAtom } from "../../recoil/atoms/selectedFileAtom";
import { projectFilesAtom } from "../../recoil/atoms/projectFilesAtom";
// const structure = [
//     {
//         type: "folder",
//         name: "client",
//         files: [
//             {
//                 type: "folder",
//                 name: "ui",
//                 files: [
//                     { type: "file", name: "Toggle.js" },
//                     { type: "file", name: "Button.js" },
//                     { type: "file", name: "Button.style.js" },
//                 ],
//             },
//             {
//                 type: "folder",
//                 name: "components",
//                 files: [
//                     { type: "file", name: "Tree.js" },
//                     { type: "file", name: "Tree.style.js" },
//                 ],
//             },
//             { type: "file", name: "setup.js" },
//             { type: "file", name: "setupTests.js" },
//         ],
//     },
//     {
//         type: "folder",
//         name: "packages",
//         files: [
//             {
//                 type: "file",
//                 name: "main.js",
//             },
//         ],
//     },
//     { type: "file", name: "index.js" },
// ];


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

    const handleClick = (node) => {
        console.log(node)
        if (node['node']['type'] === "file" && node['node']['path'] !== selectedFile['path']) {
            console.log(JSON.stringify(node['node']['path']))
            // if (node['node']['content'] === false || node['node']['content'] === "") {
            //     socket?.emit("fetchContent", { path: node['node']['path'] }, (data) => {
            //         // console.log(data)
            //         // // node['node']['content'] = data;
            //         let updatedFiles = [..._data].map((item) => {
            //             if (item.path === node['node']['path']) return { ...item, content: true };
            //             else return item;
            //         });

            //         // setProjectFiles(updatedFiles);
            //         const key = node['node']['path'];

            //         setFileContents(content => ({ ...content, [key]: data }))
            //         // setSelectedFile(file);
            //     });
            // }
            setSelectedFile({ 'path': node['node']['path'], 'name': node['node']['name'] });
            console.log(`Side Panel 78: ${JSON.stringify(selectedFile)}`)


            console.log(selectedFileAtom);
            console.log(node);

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