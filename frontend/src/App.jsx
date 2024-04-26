import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./index.css"
import CodeEditor from './components/widgets/CodeEditor'
import OutputWindow from './components/widgets/OutputWindow'
import SidePanel from './components/widgets/SidePanel'
import Terminal from "./components/widgets/Terminal"
import CodingPage from './components/pages/CodingPage'
function App() {
  const [count, setCount] = useState(0)

  return (

    <CodingPage />

  )
}

export default App
