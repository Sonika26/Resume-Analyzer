import { Routes, Route } from 'react-router-dom'  
import Home from './pages/Home'
import Login from './pages/Login'
import Signin from './pages/Signin'
import './App.css'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin/>} />
    </Routes>
    </>
  )
}

export default App
