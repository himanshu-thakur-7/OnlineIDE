import { useState } from 'react'
import './App.css'
import CodeEditor from './components/CodeEditor'; "./components/CodeEditor";
import SidePanel from './components/SidePanel'; "./components/SidePanel";
import Terminal from './components/Terminal'; "./components/Terminal";

function App() {
  const [count, setCount] = useState(0)

  return (

    <div className="flex">
      <SidePanel />
      <CodeEditor />
      <Terminal />
    </div>

  )
}

export default App
