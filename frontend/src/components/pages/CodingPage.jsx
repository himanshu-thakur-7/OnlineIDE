import SidePanel from "../widgets/SidePanel";
import CodeEditor from "../widgets/CodeEditor";
import OutputWindow from "../widgets/OutputWindow";
import TerminalComponent from "../widgets/Terminal";
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../widgets/Loader"
import { io } from 'socket.io-client';

import { useRecoilState } from "recoil";

import { projectFilesAtom } from "../../recoil/atoms/projectFilesAtom";
import OutputPane from "../widgets/OutputPane";

const WS_URL = 'http://localhost:8000';


const URL = "http://localhost:8000/project"
const CodingPage = () => {
    const [_socket, setSocket] = useState(null);
    const [projFiles, setProjectFiles] = useRecoilState(projectFilesAtom);
    const { state } = useLocation();
    console.log(state)
    const [loaded, setLoaded] = useState(false);
    const { roomId } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const resp = await axios.post(URL, { 'env': state, 'replId': roomId });
            console.log(resp);
            console.log(roomId)
            const socket = io(WS_URL + `?roomId=${roomId}&env=${state}`);
            console.log(socket);
            setSocket(socket);
            setLoaded(true);
        }
        fetchData();
    }, []);


    return <div className="bg-cyan-950 h-screen text-yellow-100 items-center justify-center">
        {loaded === true ? <div className="grid grid-cols-8 bg-cyan-950 h-screen w-screen text-yellow-100 divide-x-2 px-4">
            <div className='col-span-2  p-4'>
                <SidePanel socket={_socket} />
            </div>
            <div className='col-span-3  p-4'>
                <CodeEditor socket={_socket} />
            </div>
            <div className='col-span-3 p-4 '>
                <OutputPane socket={_socket} />
                {/* <div className="row-span-2  px-4">
                    <TerminalComponent socket={_socket} />
                </div> */}


            </div>
        </div> : <Loader />}
    </div>
}

export default CodingPage;