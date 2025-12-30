import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courseServices";
import { useNavigate, useLocation } from "react-router-dom";
import homeImg from "../assets/pexels/homeimg.png";
import "./home.css";
import { toast } from "react-toastify";
import { isStudentRegistered } from "../services/studentServices";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses();
        setCourses(result.data || []);
      } catch (error) {
        console.error("Failed to load courses", error);
      }
    };

    fetchCourses();
  }, [location.pathname]);

  const goToRegister = (courseId, courseName) => {
    navigate("/register", {
      state: { courseId, courseName },
    });
  };

  /* ================= VIEW VIDEOS LOGIC ================= */
const handleViewVideos = async (courseId) => {
  const token = sessionStorage.getItem("token");

  // 1️⃣ Not logged in
  if (!token) {
    navigate("/login");
    return;
  }

  // 2️⃣ ADMIN → allow directly
  if (user?.role === "admin") {
    navigate(`/videos/${courseId}`);
    return;
  }

  // 3️⃣ STUDENT → check registration
  if (user?.role === "student") {
    const result = await isStudentRegistered(courseId, token);

    if (result.status !== "success") {
      toast.error("Authorization failed");
      return;
    }

    if (!result.data.registered) {
      toast.warn("Please register first");
      return;
    }

    navigate(`/videos/${courseId}`);
    return;
  }

  // 4️⃣ Any other role
  toast.error("Access denied");
};


  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="container my-5">
        <div className="row align-items-center hero-section">

          <div className="col-md-7 hero-text">
               <h1 className="fw-bold text-info mb-3">
                 Welcome to the Sunbeam Online Learning Portal
               </h1>
               <p className="text-muted fs-5">
                 Enroll in industry-focused courses, track your learning journey,
                 and access expert-led video lectures anytime, anywhere.
               </p>
      </div>

          <div className="col-md-5 d-flex justify-content-center hero-image-wrapper">
            <img
              src={homeImg}
              alt="Online Courses"
              className="img-fluid home-hero-img"
            />
          </div>

        </div>
      </div>

      {/* ================= COURSES SECTION ================= */}
      <div className="bg-light py-5">
        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Available Courses</h3>
            <span className="text-muted small">
              Browse and register for upcoming batches
            </span>
          </div>

          <div className="row g-4">
            {courses.length === 0 && (
              <div className="text-center text-muted">
                No courses available
              </div>
            )}

            {courses.map((course) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={course.course_id}
              >
                <div className="card course-card h-100">
                  <div className="card-body d-flex flex-column">

                    <h6 className="course-title mb-2">
                      {course.course_name}
                    </h6>

                    <p className="course-desc mb-3 flex-grow-1">
                      {course.description}
                    </p>

                    <p className="mb-1 small">
                      <strong>Fees:</strong> ₹{course.fees}
                    </p>
                    <p className="mb-1 small">
                      <strong>Start:</strong> {course.start_date}
                    </p>
                    <p className="small">
                      <strong>End:</strong> {course.end_date}
                    </p>

                    {/* 👇 ADMIN-ONLY STUDENT COUNT */}
                    {isAdmin && (
                      <div className="student-count-badge">
                        <span className="student-icon">🧑‍🎓</span>
                        <span className="student-text">
                          {course.student_count || 0} enrolled
                        </span>
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-info btn-sm text-white flex-fill"
                        onClick={() =>
                          goToRegister(course.course_id, course.course_name)
                        }
                      >
                        Register
                      </button>

                      <button
                        className="btn btn-outline-info btn-sm flex-fill"
                        onClick={() => handleViewVideos(course.course_id)}
                      >
                        View Videos
                      </button>
                    </div>

                    <div className="course-note mt-3">
                      Courses are public. Login and register to unlock videos.
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= CAREER SECTION ================= */}
          <div className="career-section mt-5">
            <div className="container">

              <div className="mb-5">
                <h2 className="career-title">Invest in your career</h2>
                <p className="text-muted mt-2" style={{ maxWidth: 520 }}>
                  Build in-demand skills, earn recognized credentials,
                  and advance your career with industry-focused learning paths.
                </p>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="career-card fade-up">
                    <div className="career-icon">🎯</div>
                    <h5>Explore in-demand skills</h5>
                    <p>Learn practical skills aligned with industry needs.</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="career-card fade-up delay-1">
                    <div className="career-icon">📜</div>
                    <h5>Earn credentials</h5>
                    <p>Certificates that strengthen your resume.</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="career-card fade-up delay-2">
                    <div className="career-icon">⭐</div>
                    <h5>Expert mentors</h5>
                    <p>Guidance from real-world professionals.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}