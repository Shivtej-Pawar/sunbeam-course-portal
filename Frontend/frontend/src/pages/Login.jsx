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
    if (!email || !password) {
      toast.warn("Email and password are required");
      return;
    }

    try {
      const api = role === "student" ? studentLogin : adminLogin;
      const res = await api(email, password);

      if (res.status === "success") {
        // STORE AUTH DATA
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data));

        toast.success("Login successful");

        //  ALWAYS GO TO HOME (ADMIN OR STUDENT)
        navigate("/home", { replace: true });
      } else {
        toast.error(res.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm p-4" style={{ width: 360, borderRadius: 12 }}>

        <h4 className="text-center mb-4 fw-semibold">
          Login to Sunbeam Portal
        </h4>

        {/* ROLE SELECT */}
        <select
          className="form-select mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        {/* EMAIL */}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          className="btn btn-info w-100 fw-semibold text-white"
          onClick={login}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;
