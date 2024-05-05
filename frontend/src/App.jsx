import './App.css'
import "./index.css"
import { Route, Routes } from "react-router-dom";
import CodingPage from './components/pages/CodingPage'
import HomePage from './components/pages/HomePage'
function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/codingPage" element={<CodingPage />} />
    </Routes>



  )
}

export default App
