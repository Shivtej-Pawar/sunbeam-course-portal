import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courseServices";
import { useNavigate } from "react-router";
import homeImg from "../assets/pexels/homeimg.png";
import "./home.css";

export default function Home() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses("2025-12-07", "2025-12-31");
        setCourses(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  const goToRegister = (courseId, courseName) => {
    navigate("/register", {
      state: { courseId, courseName }
    });
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="container my-5">
        <div className="row align-items-center hero-section">

          {/* LEFT CONTENT */}
          <div className="col-md-7 hero-text">
            <h1 className="fw-bold text-info mb-3">
              Welcome to Sunbeam Online Course Portal
            </h1>

            <p className="text-muted fs-5">
              Register for industry-oriented courses, manage your learning,
              and watch high-quality video lectures from anywhere.
            </p>

          </div>

          {/* RIGHT IMAGE */}
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
            {courses.map(course => (
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

                    <div className="d-flex gap-2 mt-3">
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
{/* ================= CAREER INVEST SECTION ================= */}
<div className="career-section">
  <div className="container">

    {/* Section Heading */}
    <div className="mb-5">
      <h2 className="career-title">Invest in your career</h2>
      <p className="text-muted mt-2" style={{ maxWidth: 520 }}>
        Build in-demand skills, earn recognized credentials, and
        advance your career with industry-focused learning paths.
      </p>
    </div>

    <div className="row g-4">

      {/* Card 1 */}
      <div className="col-md-4">
        <div className="career-card fade-up">
          <div className="career-icon">🎯</div>
          <h5>Explore in-demand skills</h5>
          <p>
            Learn practical skills in AI, full-stack development,
            cloud computing, and core computer science aligned with
            current industry needs.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-md-4">
        <div className="career-card fade-up delay-1">
          <div className="career-icon">📜</div>
          <h5>Earn career-ready credentials</h5>
          <p>
            Receive course completion certificates that validate
            your skills and strengthen your resume for job and
            internship opportunities.
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-md-4">
        <div className="career-card fade-up delay-2">
          <div className="career-icon">⭐</div>
          <h5>Learn from experienced mentors</h5>
          <p>
            Get guidance from instructors with real-world industry
            experience, focused on problem-solving and hands-on
            learning.
          </p>
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
