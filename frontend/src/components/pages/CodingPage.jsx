import SidePanel from "../widgets/SidePanel";
import CodeEditor from "../widgets/CodeEditor";
import OutputWindow from "../widgets/OutputWindow";
import Terminal from "../widgets/Terminal";
const CodingPage = () => {

    return <div className='grid grid-cols-4 bg-cyan-950 h-screen text-yellow-100 divide-x-2 px-4'>
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
    </div>
}

export default CodingPage;