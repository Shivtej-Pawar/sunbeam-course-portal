  import { useEffect, useState } from "react";
  import "./StudentList.css";
  import { getEnrolled_students } from "../../services/studentServices";
  import { toast } from "react-toastify";
  import { getAllCourses } from "../../services/courseServices";

  function StudentList() {
      const [students,setStudents]=useState([])
      const [course,setCourse]=useState([])
      const [selectedCourse,setSelectedCourse]=useState(null)
      const [sortField,setSortField]=useState("reg_no")
      const [sortOrder,setSortOrder]=useState("asc")
      const [searchTerm,setSearchTerm]=useState("")

      useEffect(()=>{ 
        fetchStudents()
        getCourses()
      },[])
      
    const fetchStudents=async (courseId=null)=>{
          try {
            const token=sessionStorage.getItem('token')
            if (!token) {
                toast.error("Session expired. Please login again.")
                return
            }
            const result=await getEnrolled_students(courseId,token)     
            if(result.status==='success')
            {
              setStudents(result.data)
            }
            else
            {
              toast.error(result.error || "Failed to fetch students")
            }
          } catch (error) {
            toast.error('Cannot fetch students')
          }
      }

        const getCourses=async()=>{
          const result=await getAllCourses("2025-12-07", "2025-12-31")
          if (result.status=='success')
          {
              setCourse(result.data)
          }
          else
            {
              toast.error(result.error || "Failed to fetch corses")
            }
        }
       
        const sortedStudets=[...students].sort((a,b)=>{
             let n1=a[sortField]
             let n2=b[sortField]

             if(typeof n1==='string')
             {
               n1=n1.toLowerCase()
               n2=n2.toLowerCase()
             }

             if(n1<n2) return sortOrder ==="asc" ? -1:1
             if(n1>n2) return sortOrder ==="asc" ? 1:-1
             return 0
        })

        const filteredStudents=sortedStudets.filter(student=>{
            const term=searchTerm.toLowerCase()
            return(
               student.name.toLowerCase().includes(term) ||
               student.email.toLowerCase().includes(term) ||
               (student.mobile_no && student.mobile_no.includes(term))
            )
        })
          
        
    
        
        

    return (
      <div className="container mt-4 student-list">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-semibold text-info mb-1">
              Admin – Registered Students
            </h3>
            <p className="text-muted mb-0">
              View, search and manage students enrolled in courses
            </p>
          </div>
        </div>

        {/* FILTER + SEARCH CARD */}
        <div className="card shadow-sm filter-card mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">

              {/* COURSE FILTER */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Course</label>
                <select className="form-select"
                 value={selectedCourse ||""}
                 onChange={
                    (e)=>{
                       const courseId=e.target.value 
                       setSelectedCourse(courseId)
                       fetchStudents(courseId)
                    }
                } >
                
                  <option value={""}>All Courses</option>
                  {
                    course.map(c=>
                          <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
                    )
                  }
                </select>
              </div>

              {/* SEARCH */}
              <div className="col-md-5">
                <label className="form-label fw-semibold">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or mobile"
                  onChange={(e)=>setSearchTerm(e.target.value)}
                />
              </div>

              {/* SORT */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Sort By</label>
                <div className="d-flex gap-2">
                  <select className="form-select"
                        value={sortField}
                        onChange={(e)=>setSortField(e.target.value)}
                     >
                    <option value={"reg_no"}>Registration Date</option>
                    <option value={"name"}>Name</option>
                    <option value={"course_name"}>Course</option>
                  </select>
                  <button className="btn btn-outline-secondary px-3" onClick={()=>setSortOrder(prev=>(prev==='asc'? 'desc':'asc'))}>
                    {sortOrder==='asc'? "Asc":"Desc"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        
        <div className="card shadow-sm table-card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">Registered Students</h5>
            <span className="badge bg-info text-dark"> {students.length} Students</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Course</th>
                  <th className="text-center">Reg. No ▲</th>
                </tr>
              </thead>

              <tbody>
                {/* SAMPLE DATA */}
                {
                  filteredStudents.map(student=>
                    <tr key={student.reg_no}>
                  <td className="fw-semibold">{student.name}</td>
                  <td className="text-muted">{student.email}</td>
                  <td>{student.mobile_no}</td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary">
                      {student.course_name}
                    </span>
                  </td>
                  <td className="text-center">{student.reg_no}</td>
                </tr>
                    
                  )
                
                }
                
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }  
  
  export default StudentList;
