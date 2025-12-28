import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProfileModal from './ProfileModal'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  // Sync navbar with login/logout
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    setUser(storedUser ? JSON.parse(storedUser) : null)
  }, [location])

  const logout = () => {
    localStorage.removeItem('user') // ✅ IMPORTANT FIX
    setUser(null)
    navigate('/login')
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg shadow-sm py-2"
        style={{ backgroundColor: '#7dd3fc' }}
      >
        <div className="container-fluid px-4">

          {/* BRAND */}
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/home">
            <span
              className="me-2 rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              S
            </span>
            Sunbeam Online Course Portal
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            {/* LEFT MENU */}
            <ul className="navbar-nav ms-4">
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark" to="/home">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark" to="/about">
                  About Sunbeam
                </Link>
              </li>

              {/* STUDENT */}
              {user?.role === 'student' && (
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-dark" to="/courses">
                    Courses
                  </Link>
                </li>
              )}

              {/* ADMIN */}
              {user?.role === 'admin' && (
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle fw-semibold text-dark"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Admin
                  </span>

                  <ul className="dropdown-menu shadow">
                    <li>
                      <Link className="dropdown-item" to="/admin/courses">
                        Manage Courses
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/videos">
                        Manage Videos
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/students">
                        Student List
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            {/* SEARCH (RESTORED ✅) */}
            <form className="d-flex ms-4" onSubmit={e => e.preventDefault()}>
              <input
                className="form-control form-control-sm me-2"
                placeholder="Search courses"
                style={{ width: 220 }}
              />
              <button className="btn btn-outline-dark btn-sm">
                Search
              </button>
            </form>

            {/* RIGHT SIDE */}
            <div className="ms-auto d-flex align-items-center gap-3">

              {user ? (
                <>
                  {/* PROFILE ICON */}
                  <button
                    className="btn btn-outline-dark btn-sm rounded-circle profile-btn"
                    onClick={() => setShowProfile(true)}
                  >
                    <i className="bi bi-person-circle fs-5"></i>
                  </button>

                  <span className="fw-semibold text-dark">
                    {user.role} — {user.email}
                  </span>

                  <button
                    className="btn btn-outline-light btn-sm fw-semibold"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link className="btn btn-outline-light btn-sm fw-semibold" to="/login">
                  Login
                </Link>
              )}

            </div>

          </div>
        </div>
      </nav>

      {/* PROFILE MODAL */}
      {showProfile && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  )
}

export default Navbar
