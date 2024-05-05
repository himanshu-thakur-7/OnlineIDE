import SidePanel from "../widgets/SidePanel";
import CodeEditor from "../widgets/CodeEditor";
import OutputWindow from "../widgets/OutputWindow";
import Terminal from "../widgets/Terminal";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../widgets/Loader"

const URL = "http://localhost:8000/project"
const CodingPage = () => {
    const { state } = useLocation();
    console.log(state)
    const [loaded, setLoaded] = useState(false);
    useEffect(async () => {
        const resp = await axios.post(URL, { 'env': state });
        console.log(resp);
        setLoaded(true);
    }, []);


    return <div>
        {loaded === true ? <div className="grid grid-cols-4 bg-cyan-950 h-screen text-yellow-100 divide-x-2 px-4">
            <div className='col-span-1  p-4'>
                <SidePanel />
            </div>
            <div className='col-span-2  p-4'>
                <CodeEditor />
            </div>
            <div className='col-span-1 p-4 divide-y-2'>
                <div class="grid grid-rows-2 h-screen">
                    <div class="row-span-1  p-4">
                        <OutputWindow />
                    </div>
                    <div class="row-span-1  p-4">
                        <Terminal />
                    </div>
                </div>

            </div>
        </div> : <Loader />}
    </div>
}

export default CodingPage;