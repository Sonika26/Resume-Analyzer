import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Resume from "./pages/Resume";
import Layout from "./components/Layout";
import ResumeEditor from "./pages/ResumeEditor";
import CoverLetterPage from "./pages/CoverLetterPage";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />

      {/* Dashboard / application pages */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/resume" element={<Resume />} />
         <Route path="/resume/new" element={<ResumeEditor />}/>
         <Route path="/coverletter" element={<CoverLetterPage />} />
      <Route path="/resume/:id/edit"  element={<ResumeEditor />}/>
      </Route>
    </Routes>
  );
}

export default App;