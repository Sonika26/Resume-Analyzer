import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#C5B3D3_0%,white_65%)]">
      <Navbar />

      <main className="p-6">
        {user ? (
          <p className="text-xl font-semibold text-purple-700">
            Welcome, {user.fullName}
          </p>
        ) : (
          <p className="text-gray-600">You are not logged in</p>
        )}
      </main>
    </div>
  );
}

export default Home;
