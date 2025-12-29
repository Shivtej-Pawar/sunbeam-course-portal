import { useEffect, useState } from "react";
import "./Courses.css";
import { toast } from "react-toastify";
import { getMyCourses } from "../services/courseServices";
import { getAllVideos } from "../services/videoServices";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

 const loadCourses = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    toast.error("Please login again");
    return;
  }

  const result = await getMyCourses(token);
  if (result.status === "success") {
    setCourses(result.data);
  } else {
    toast.error(result.error);
  }
};


  const toggleVideos = async (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    const result = await getAllVideos(courseId);
    if (result.status === "success") {
      setVideos((prev) => ({ ...prev, [courseId]: result.data }));
      setExpandedCourse(courseId);
    } else {
      toast.error("Failed to load videos");
    }
  };

  return (
    <div className="container my-4 courses-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="page-title">My Enrolled Courses</h3>
        <span className="page-subtitle">
          View courses you've registered for and access video lectures
        </span>
      </div>

      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-md-6" key={course.course_id}>
            <div className="course-card">
              <h5 className="course-title">{course.course_name}</h5>
              <p className="course-desc">{course.description}</p>

              <div className="course-meta">
                <div><strong>Course ID:</strong> {course.course_id}</div>
                <div><strong>Fees:</strong> ₹{course.fees}</div>
                <div><strong>Start Date:</strong> {course.start_date}</div>
                <div><strong>End Date:</strong> {course.end_date}</div>
                <div><strong>Video Expire Days:</strong> {course.video_expire_days}</div>
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => toggleVideos(course.course_id)}
              >
                {expandedCourse === course.course_id ? "Hide Videos" : "View Videos"}
              </button>

              {expandedCourse === course.course_id && (
                <div className="videos-section">
                  {videos[course.course_id]?.length > 0 ? (
                    videos[course.course_id].map((v, index) => (
                      <div key={v.video_id} className="video-item">
                        <div className="video-title">
                          {index + 1}. {v.title}
                        </div>
                        <div className="video-desc">{v.description}</div>
                        <a
                          href={v.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-info btn-sm mt-2"
                        >
                          Play Video
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">No videos available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
          
        {courses.length === 0 && (
          <div className="text-center text-muted">
            No enrolled courses found
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
