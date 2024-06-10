import './App.css'
import "./index.css"
import { Route, Routes } from "react-router-dom";
import CodingPage from './components/pages/CodingPage'
import HomePage from './components/pages/HomePage'
import ErrorPage from './components/pages/ErrorPage';
function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/codingPage/:roomId/:env" element={<CodingPage />} />
      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>



  )
}

export default App
