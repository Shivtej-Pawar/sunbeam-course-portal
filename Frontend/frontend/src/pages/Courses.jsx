import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courseServices";
import { useNavigate, useLocation } from "react-router";
import homeImg from "../assets/pexels/homeimg.png";
import "./home.css";

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

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="container my-5">
        <div className="row align-items-center hero-section">

          <div className="col-md-7 hero-text reveal">
            <h1 className="fw-bold text-info mb-3">
              Welcome to Sunbeam Online Course Portal
            </h1>
            <p className="text-muted fs-5">
              Register for industry-oriented courses, manage your learning,
              and watch high-quality video lectures from anywhere.
            </p>
          </div>

          <div className="col-md-5 d-flex justify-content-center hero-image-wrapper reveal reveal-delay-1">
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

          <div className="d-flex justify-content-between align-items-center mb-4 reveal">
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

            {courses.map((course, index) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={course.course_id}
              >
                <div
                  className={`card course-card h-100 reveal reveal-delay-${(index % 3) + 1}`}
                >
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

                    {/* ADMIN ONLY – STUDENT COUNT */}
                    {isAdmin && (
                      <div className="admin-count mt-2 mb-2">
                        👥 {course.student_count || 0} students enrolled
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

                      <button className="btn btn-outline-info btn-sm flex-fill">
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

              <div className="mb-5 reveal">
                <h2 className="career-title">Invest in your career</h2>
                <p className="text-muted mt-2" style={{ maxWidth: 520 }}>
                  Build in-demand skills, earn recognized credentials, and
                  advance your career with industry-focused learning paths.
                </p>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="career-card reveal">
                    <div className="career-icon">🎯</div>
                    <h5>Explore in-demand skills</h5>
                    <p>Learn practical skills aligned with industry needs.</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="career-card reveal reveal-delay-1">
                    <div className="career-icon">📜</div>
                    <h5>Earn credentials</h5>
                    <p>Certificates that strengthen your resume.</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="career-card reveal reveal-delay-2">
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
