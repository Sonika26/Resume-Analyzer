import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;