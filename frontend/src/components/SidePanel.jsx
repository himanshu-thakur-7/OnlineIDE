import React, { useState } from 'react';

const SidePanel = ({ onNewFile, onNewFolder }) => {
    const [newFileName, setNewFileName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');

    const handleNewFile = () => {
        onNewFile(newFileName);
        setNewFileName('');
    };

    const handleNewFolder = () => {
        onNewFolder(newFolderName);
        setNewFolderName('');
    };

    return (
        <div className="bg-gray-800 text-white h-screen w-1/4 p-4">
            {/* New File */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="New File Name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="p-2 w-full"
                />
                <button onClick={handleNewFile} className="mt-2 bg-blue-500 text-white p-2">
                    Create File
                </button>
            </div>

            {/* New Folder */}
            <div>
                <input
                    type="text"
                    placeholder="New Folder Name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="p-2 w-full"
                />
                <button onClick={handleNewFolder} className="mt-2 bg-green-500 text-white p-2">
                    Create Folder
                </button>
            </div>
        </div>
    );
};

export default SidePanel;
