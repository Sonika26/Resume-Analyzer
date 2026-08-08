import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import api from "../services/api";
import axios from "axios";// Change the path if necessary

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const res = await api.post("/login", { email, password });

        login(res.data.token, res.data.user);
        navigate("/");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            alert(err.response?.data?.message || "Login failed");
          } else {
            alert("Something went wrong");
          }
        }
    };

      return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#C5B3D3_0%,white_65%)]">
          <div className="flex flex-col items-center justify-center min-h-screen">
          <div>Welcome to the login page</div>

            <form onSubmit={handleSubmit}>
              <div>
              <label>Email</label>
                <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
              <label>Password</label>
                <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default Login;