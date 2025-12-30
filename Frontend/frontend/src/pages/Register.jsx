import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { registerToCourse } from "../services/courseServices";
import { getStudentProfile } from "../services/studentServices";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, courseName } = location.state || {};

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [locked, setLocked] = useState(false); // 🔒 lock name/email

  /* ================= AUTO-FETCH STUDENT DETAILS ================= */
  useEffect(() => {
    if (user?.role === "student" && token) {
      autoFillStudent();
    }
  }, []);

  const autoFillStudent = async () => {
    try {
      const res = await getStudentProfile(token);

      if (res.status === "success") {
        setName(res.data.name);
        setEmail(res.data.email);
        setMobile(res.data.mobile_no || "");
        setLocked(true); // 🔐 disable fields
      }
    } catch {
      toast.error("Failed to load profile");
    }
  };

  /* ================= REGISTER ================= */
  const register = async () => {
    if (!name) return toast.warn("Name is required");
    if (!email) return toast.warn("Email is required");
    if (!mobile) return toast.warn("Mobile is required");

    const result = await registerToCourse(
      name,
      email,
      courseId,
      mobile
    );

    if (result.status === "success") {
      toast.success("Registered successfully");
      navigate("/courses");
    } else if (result.error === "ALREADY_REGISTERED") {
      toast.info("You are already registered for this course");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center">
      <div className="register-card shadow-sm">

        <h3 className="text-center mb-4">Course Registration</h3>

        {/* NAME */}
        <input
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          disabled={locked}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          disabled={locked}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* MOBILE */}
        <input
          className="form-control mb-3"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        {/* COURSE */}
        <input
          className="form-control mb-3"
          value={courseName || ""}
          disabled
        />

        <button
          className="btn btn-info w-100 text-white fw-semibold"
          onClick={register}
        >
          Register
        </button>

        <p className="text-center mt-3 mb-0">
          Already registered?{" "}
          <Link to="/courses" className="text-info fw-semibold">
            View My Courses
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
