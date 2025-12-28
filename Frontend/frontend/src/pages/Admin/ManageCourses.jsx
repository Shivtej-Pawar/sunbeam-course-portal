import { useState, useEffect } from "react";
import "./ManageCourses.css";
import { addCourses, deleteCourse, getAllCourses, updateCourse } from "../../services/courseServices";
import { toast } from "react-toastify";

function ManageCourses() {

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [fees, setFees] = useState("");
  const [videoExpireDays, setVideoExpireDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showEditModal,setShowEditModal]=useState(false)
  const [selectedCourses,setSelectedCourses]=useState(null)

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    const result = await getAllCourses("2025-12-07", "2025-12-31");
    if (result.status === "success") {
      setCourses(result.data);
    }
  };

  const insertCourses = async () => {
    if (courseName === "") toast.warn("Course Name must be entered");
    else if (description === "") toast.warn("Description must be entered");
    else if (!fees) toast.warn("Fees must be entered");
    else if (videoExpireDays === "") toast.warn("Video Expire Days must be entered");
    else if (startDate === "") toast.warn("Start Date must be entered");
    else if (endDate === "") toast.warn("End Date must be entered");
    else {
      const token = sessionStorage.getItem("token");
      const result = await addCourses(
        courseName,
        description,
        fees,
        startDate,
        endDate,
        videoExpireDays,
        token
      );

      if (result.status === "success") {
        toast.success("Course added successfully");
        fetchAllCourses();
      } else {
        toast.error(result.error || "Failed to add course");
      }
    }
  };

  
  const trashCourse=async (courseId)=>{
          const token=sessionStorage.getItem('token')
          const result=await deleteCourse(courseId,token)
          if (result.status === "success") {
            toast.success("Course deleted successfully");            
            fetchAllCourses()
      } else {
          toast.error(result.error || "Failed to delete course");
      }
  }
   
  const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

 const updatedCourses=async ()=>{
       const token=sessionStorage.getItem('token')
       const result=await updateCourse(
         selectedCourses.course_id,
         selectedCourses.course_name,
         selectedCourses.description,
         selectedCourses.fees,
         formatDateForInput(selectedCourses.start_date),
         formatDateForInput(selectedCourses.end_date),
         selectedCourses.video_expire_days,
         token
       ) 
       if (result.status === "success") {
            toast.success("Course updated successfully");            
            fetchAllCourses()
            setShowEditModal(false)
      } else {
          toast.error(result.error || "Failed to update course");
      }

 }

    
  return (

    

    <div className="container my-4 manage-courses">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-info fw-semibold">Admin – Manage Courses</h3>
        <span className="text-muted small">Add, edit, and delete courses</span>
      </div>

      <div className="row g-4">

        {/* COURSE LIST */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">

            <div className="card-header d-flex justify-content-between">
              <h5 className="mb-0">Courses</h5>
              <span className="badge bg-info text-dark">
                {courses.length} total
              </span>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-bordered table-hover mb-0 course-table">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name & Description</th>
                      <th>Fees</th>
                      <th>Dates</th>
                      <th>Video Expire</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {courses.map(course => (
                      <tr key={course.course_id}>
                        <td>{course.course_id}</td>
                        <td>
                          <strong>{course.course_name}</strong>
                          <p className="text-muted small mb-0">
                            {course.description}
                          </p>
                        </td>
                        <td>₹ {course.fees}</td>
                        <td className="small">
                          {course.start_date}<br />→ {course.end_date}
                        </td>
                        <td className="text-center">
                          {course.video_expire_days}
                        </td>
                        <td>
                          {/* ✅ FIXED BUTTON SPACING */}
                          <div className="d-flex gap-2 justify-content-center">
                            <button className="btn btn-outline-info btn-sm" onClick={()=>{
                              setSelectedCourses(course)
                              setShowEditModal(true);
                            }}
                             >
                              ✏️ Edit
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={()=>trashCourse(course.course_id)} >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ADD COURSE */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">

            <div className="card-header">
              <h5 className="mb-0">Add New Course</h5>
            </div>

            <div className="card-body d-flex flex-column">

              <div className="mb-3">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={e => setCourseName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fees (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={e => setFees(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Video Expire Days</label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={e => setVideoExpireDays(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-auto text-end">
                <button
                  className="btn btn-info text-white px-4"
                  onClick={insertCourses}
                >
                  Add Course
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {showEditModal && selectedCourses && (
  <div className="modal fade show d-block edit-course-modal">
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">

        {/* MODAL HEADER */}
        <div className="modal-header">
          <h5 className="modal-title">Edit Course</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowEditModal(false)}
          ></button>
        </div>

        {/* MODAL BODY */}
        <div className="modal-body">

          <div className="mb-3">
            <label className="form-label">Course Name</label>
            <input
              type="text"
              className="form-control"
              value={selectedCourses.course_name}
              onChange={(e) =>
                setSelectedCourses({
                  ...selectedCourses,
                  course_name: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={selectedCourses.description}
              onChange={(e) =>
                setSelectedCourses({
                  ...selectedCourses,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fees (₹)</label>
              <input
                type="number"
                className="form-control"
                value={selectedCourses.fees}
                onChange={(e) =>
                  setSelectedCourses({
                    ...selectedCourses,
                    fees: e.target.value,                    
                  } )
                }
              />
            </div>


            <div className="col-md-6 mb-3">
              <label className="form-label">Video Expire Days</label>
              <input
                type="number"
                className="form-control"
                value={selectedCourses.video_expire_days}
                onChange={(e) =>
                  setSelectedCourses({
                    ...selectedCourses,
                    video_expire_days: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={formatDateForInput(selectedCourses.start_date)}
                onChange={(e) =>
                  setSelectedCourses({
                    ...selectedCourses,
                    start_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={formatDateForInput(selectedCourses.end_date)}
                onChange={(e) =>
                  setSelectedCourses({
                    ...selectedCourses,
                    end_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-info text-white" onClick={updatedCourses} >
            Update Course
          </button>
        </div>

      </div>
    </div>
  </div>
)}




    </div>      
  );
  
}

export default ManageCourses;
