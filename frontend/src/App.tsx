import { Routes, Route } from 'react-router-dom'  
import Home from './pages/Home'
import Login from './pages/Login'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import './App.css'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/analyze" element={<Analyze/>} />
    </Routes>
    </>
  )
}

export default App
