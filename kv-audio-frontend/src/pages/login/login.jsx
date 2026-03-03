import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin(
    {
      onSuccess: (res) => {
        console.log(res);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/googleLogin`, {
          accessToken: res.access_token
        }).then(response => {
          toast.success("Login successful!");
          const user = response.data.user;
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("email", user.email);

          if (user.role === "Admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/home");
          }
        }).catch(error => {
          console.error("Google login failed:", error);
          toast.error(error.response.data.error || "Google login failed. Please try again.");
        });
      }
    }
  );


  const handleSubmit = (e) => {
    e.preventDefault();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    axios.post(`${backendUrl}/api/users/logging`, { email, password })
      .then(response => {
        toast.success("Login successful!");

        const user = response.data.user;
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("email", user.email);

        // Check if email is verified
        if (user.emailVerified === false) {
          toast("Please verify your email before logging in.");
          navigate("/verify-email");
          return;
        }

        // Redirect based on user role
        if (user.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      })
      .catch(error => {
        console.error("Login failed:", error);
        toast.error(error.response.data.error || "Login failed. Please try again.");
      });

  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/Login_bg_Image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-[420px] mx-4 z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center">
        <img
          src="/KV_Audio_Logo.png"
          alt="KV Audio Logo"
          className="w-[120px] h-auto object-contain mb-6 drop-shadow-lg"
        />

        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Welcome Back</h2>
        <p className="text-gray-200 text-sm mb-8">Login to your account to continue</p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="relative group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              placeholder="Email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
            >
              Email Address
            </label>
          </div>

          <div className="relative group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
            >
              Password
            </label>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-200">
            <label className="flex items-center cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="mr-2 rounded accent-blue-500 w-4 h-4 cursor-pointer" />
              Remember me
            </label>
            <a href="#" className="hover:text-blue-300 transition-colors">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transform transition hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/30"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => googleLogin()}
            className="w-full mt-2 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all"
          >
            <img src="google_logo.png" alt="Google Logo" className="w-5 h-5" />
            Sign in with Google
          </button>




        </form>

        <p className="mt-8 text-sm text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-white font-semibold hover:text-blue-300 underline-offset-2 hover:underline transition-all">
            Create Account
          </a>
        </p>
      </div>
    </div>
  )
}

