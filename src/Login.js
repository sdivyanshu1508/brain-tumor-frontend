import { useState } from "react";
//import { useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
   axios.defaults.withCredentials = true;
  const login = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/login",
      { username, password },
      { withCredentials: true }
    );

    // ✅ ROLE-BASED REDIRECT
    if (res.data.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }

  } catch {
    alert("Invalid login");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white">
      <div className="glass p-6 rounded-xl glow-border w-80">
        <h2 className="glow-text mb-4 text-center">Login</h2>

        <input
          placeholder="Username"
          className="w-full p-2 mb-3 bg-black border border-cyan-700 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-black border border-cyan-700 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full glow-button py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          No account? <a href="/register" className="text-cyan-400">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;