import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      // API call
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      // assume backend in return user info na token
      const user = res.data.user; // {id, username, role}
      const token = res.data.token;

      // ✅ Store token & user info inside handleLogin
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.username); // optional
      localStorage.setItem("userRole", user.role);

      // role-based redirect
      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "customer") {
        navigate("/userDashboard");
      } else {
        alert("Unknown role");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Check username and password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-container">
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
