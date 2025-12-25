import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'

// Admin Pages
import ManageCourses from './pages/Admin/ManageCourses'
import ManageVideos from './pages/Admin/ManageVideos'
import StudentList from './pages/Admin/StudentList'

// Toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Navbar />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        pauseOnHover
        closeOnClick
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        {/* Admin Routes */}
        <Route path="/admin/courses" element={<ManageCourses />} />
        <Route path="/admin/videos" element={<ManageVideos />} />
        <Route path="/admin/students" element={<StudentList />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
