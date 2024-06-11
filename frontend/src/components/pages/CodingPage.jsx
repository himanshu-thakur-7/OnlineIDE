import SidePanel from "../widgets/SidePanel";
import CodeEditor from "../widgets/CodeEditor";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import Loader from "../widgets/Loader"
import { io } from 'socket.io-client';
import { useRecoilState, useRecoilValue } from "recoil";
import { devUrlAtom } from "../../recoil/atoms/devUrlAtom";
import OutputPane from "../widgets/OutputPane";
const WS_URL = 'http://localhost:8000';

const CodingPage = () => {
    const [_socket, setSocket] = useState(null);
    const [_devURL, setDevURL] = useRecoilState(devUrlAtom);
    const devUrl = useRecoilValue(devUrlAtom);
    // console.log(state)
    const [loaded, setLoaded] = useState(false);
    const { roomId, env } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            console.log(roomId)
            const socket1 = io(WS_URL + `?roomId=${roomId}&env=${env}`);
            socket1.on('containerCreated', ({ webSocketPort, devPort }) => {
                console.log("Container URL:: ", webSocketPort)
                const socket = io(`http://localhost:${webSocketPort}` + `?roomId=${roomId}&env=${env}`);
                setDevURL(`http://localhost:${devPort}`)
                setSocket(socket);
                setLoaded(true);
            })
        }
        fetchData();
    }, []);


    return <div className="bg-cyan-950 h-screen text-yellow-100 items-center justify-center">
        {loaded === true ? <div className="grid grid-cols-10 bg-cyan-950 h-screen w-screen text-yellow-100 divide-x-2 px-4">
            <div className='col-span-2  p-4'>
                <SidePanel socket={_socket} />
            </div>
            <div className='col-span-5  p-4'>
                <CodeEditor socket={_socket} />
            </div>
            <div className='col-span-3 p-4 '>
                <OutputPane socket={_socket} />
            </div>
            <div>
                <div className="absolute top-2 right-4">
                    <button className="relative inline-flex items-center justify-center p-0.25 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={() => window.open(`${devUrl}`, '_blank', 'noopener')}>
                        <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            View Output
                        </span>
                    </button>
                </div>
            </div>
        </div> : <Loader />}
    </div>
}

export default CodingPage;