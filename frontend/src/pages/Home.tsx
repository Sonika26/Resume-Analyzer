import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api"

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/message")
      .then((response) => {
        setMessage(response.data.reply);  
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []); // run once on mount

  
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#C5B3D3_0%,white_65%)]">
      {/* Navbar */}
      <Navbar />
  
      {/* Hero Section */}
      <main>
       <p>{message}</p>
      </main>
    </div>
  );
}

export default Home;
