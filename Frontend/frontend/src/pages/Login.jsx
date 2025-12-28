import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLogin, adminLogin } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const login = async () => {
    if (email === "" || password === "") {
      toast.warn("Email and password are required");
      return;
    }

    const api = role === "student" ? studentLogin : adminLogin;
    const res = await api(email, password);

    if (res.status === "success") {
      // ✅ STORE TOKEN IN ONE PLACE ONLY
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("Login successful");

      // ✅ ROLE BASED REDIRECT
      if (role === "admin") {
        navigate("/admin/videos");
      } else {
        navigate("/home");
      }
    } else {
      toast.error(res.error || "Login failed");
    }
  };

  return (
    <div className="container w-25 mt-5">
      <h3 className="text-center mb-3">Login</h3>

      <select
        className="form-select mb-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <input
        className="form-control mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-info w-100" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;
