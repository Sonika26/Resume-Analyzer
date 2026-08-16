import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, FileText, ArrowRight } from "lucide-react";
import axios from "axios";

import { AuthContext } from "../Context/AuthContext";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);

      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Login failed");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">

      {/* ================= LEFT SECTION ================= */}


      {/* Background Decorations */}


      {/* Logo */}


      {/* Main Content */}


      {/* ================= RIGHT SECTION ================= */}

      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">


          {/* Mobile Logo */}

          <div className="lg:hidden flex justify-center mb-10">

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">

                <FileText className="w-6 h-6 text-white" />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  IntelliResume
                </h1>

                <p className="text-xs text-slate-500">
                  AI Resume Analyzer
                </p>

              </div>

            </Link>

          </div>


          {/* Heading */}

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to your IntelliResume account.
            </p>

          </div>


          {/* Login Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-900
                  placeholder:text-slate-400
                  outline-none
                  transition-all
                  focus:border-slate-400
                  focus:ring-4
                  focus:ring-slate-200
                "
              />

            </div>


            {/* Password */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    h-12
                    pl-4
                    pr-12
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    transition-all
                    focus:border-slate-400
                    focus:ring-4
                    focus:ring-slate-200
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-2
                    text-slate-400
                    hover:text-slate-600
                    transition
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}

                </button>

              </div>

            </div>


            {/* Remember Me */}

            <div className="flex items-center">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  className="
                    w-4
                    h-4
                    rounded
                    border-slate-300
                    accent-slate-700
                  "
                />

                <span className="text-sm text-slate-600">
                  Remember me
                </span>

              </label>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                w-full
                h-12
                rounded-xl
                bg-slate-900
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-sm
                transition-all
                duration-300
                hover:bg-slate-800
                hover:shadow-lg
                hover:-translate-y-0.5
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
              "
            >

              {loading ? (
                <>

                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Signing in...

                </>
              ) : (
                <>

                  Sign in

                  <ArrowRight
                    className="
                      w-5
                      h-5
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />

                </>
              )}

            </button>

          </form>


          {/* Divider */}

          <div className="relative my-8">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">

              <span className="bg-[#f7f8fa] px-4 text-sm text-slate-400">
                New to IntelliResume?
              </span>

            </div>

          </div>


          {/* Signup */}

          <Link
            to="/signin"
            className="
              w-full
              h-12
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              font-semibold
              flex
              items-center
              justify-center
              transition-all
              hover:bg-slate-50
              hover:border-slate-300
            "
          >
            Create an account
          </Link>


          {/* Terms */}

          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">

            By continuing, you agree to IntelliResume's{" "}

            <Link
              to="/terms"
              className="text-slate-600 hover:text-slate-900"
            >
              Terms of Service
            </Link>

            {" "}and{" "}

            <Link
              to="/privacy"
              className="text-slate-600 hover:text-slate-900"
            >
              Privacy Policy
            </Link>

            .

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;