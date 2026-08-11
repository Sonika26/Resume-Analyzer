import { useState , useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, FileText, Sparkles, ArrowRight } from "lucide-react";
import api from "../services/api";
import { AuthContext } from "../Context/AuthContext";






const Signin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[ showPassword , setShowPassword] = useState(false);
    const[rememberMe , setRememberMe] = useState(false);
     const { login } = useContext(AuthContext);
    const [fullName , setfullName] = useState("");
    const navigate = useNavigate();



     const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            const res = await api.post("/signup" , {fullName , email , password});
              login(res.data.token, res.data.user);
              navigate("/");
        }catch(err){
            console.log(err , "there is a error in signing up...");

        }



     }

    return(
         <div className="min-h-screen bg-[#F9F7FB] flex">

      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#C5B3D3]">

        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#A58ABB]/30 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit">

            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 text-[#8F6AA8]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                IntelliResume
              </h1>

              <p className="text-xs text-slate-700">
                AI Resume Analyzer
              </p>
            </div>

          </Link>

          {/* Main Content */}
          <div className="max-w-lg">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-slate-800 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-powered career intelligence
            </div>

            <h2 className="text-5xl font-bold leading-tight text-slate-900">
              Build a resume that
              <span className="block text-white">
                gets noticed.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Analyze your resume, discover skill gaps, and improve your
              chances of landing your dream job with IntelliResume.
            </p>

          </div>

          {/* Bottom */}
          <p className="text-sm text-slate-700">
            © {new Date().getFullYear()} IntelliResume. All rights reserved.
          </p>

        </div>
      </div>


      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">

            <Link to="/" className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#C5B3D3] flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-900" />
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
              Welcome back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to your IntelliResume account.
            </p>

          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>

              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Name
              </label>

              <input
                id="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setfullName(e.target.value)}
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
                  focus:border-[#C5B3D3]
                  focus:ring-4
                  focus:ring-[#C5B3D3]/20
                "
              />

            </div>

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                  focus:border-[#C5B3D3]
                  focus:ring-4
                  focus:ring-[#C5B3D3]/20
                "
              />

            </div>


            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#8F6AA8] hover:text-[#76558F]"
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
                    focus:border-[#C5B3D3]
                    focus:ring-4
                    focus:ring-[#C5B3D3]/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-2
                    text-slate-400
                    hover:text-slate-600
                  "
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
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
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="
                    w-4
                    h-4
                    rounded
                    border-slate-300
                    accent-[#C5B3D3]
                  "
                />

                <span className="text-sm text-slate-600">
                  Remember me
                </span>

              </label>

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="
                group
                w-full
                h-12
                rounded-xl
                bg-[#C5B3D3]
                text-slate-900
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-sm
                transition-all
                duration-300
                hover:bg-[#B8A2C8]
                hover:shadow-lg
                hover:-translate-y-0.5
                active:translate-y-0
              "
            >
              Sign in

              <ArrowRight
                className="
                  w-5
                  h-5
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </button>

          </form>


          {/* Divider */}
          <div className="relative my-8">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-[#F9F7FB] px-4 text-sm text-slate-400">
                New to IntelliResume?
              </span>
            </div>

          </div>


          {/* Signup */}
          <Link
            to="/signup"
            className="
              w-full
              h-12
              rounded-xl
              border
              border-[#C5B3D3]
              bg-white
              text-slate-700
              font-semibold
              flex
              items-center
              justify-center
              transition-all
              hover:bg-[#F5EFF8]
              hover:border-[#B8A2C8]
            "
          >
            Create an account
          </Link>


          {/* Terms */}
          <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
            By continuing, you agree to IntelliResume's{" "}
            <Link
              to="/terms"
              className="text-slate-600 hover:text-[#8F6AA8]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-slate-600 hover:text-[#8F6AA8]"
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

export default Signin;
