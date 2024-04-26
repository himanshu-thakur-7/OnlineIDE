import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./index.css"
import CodeEditor from './components/CodeEditor'
import OutputWindow from './components/OutputWindow'
import SidePanel from './components/SidePanel'
import Terminal from "./components/Terminal"
function App() {
  const [count, setCount] = useState(0)

  return (

    <div className='grid grid-cols-4 bg-cyan-950 h-screen text-yellow-100 divide-x-2 px-4'>
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

  )
}

export default App
