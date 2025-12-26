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

            <p className="small mt-3">
              <strong>Tip:</strong>{" "}
              <span className="text-danger">admin@example.com</span> /{" "}
              <span className="text-danger">admin@123</span>
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

        </div>
      </div>
    </>
  );
}