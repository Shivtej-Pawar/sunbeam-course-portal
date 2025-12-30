import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "./ProfileModal.css"

import {
  uploadProfilePic,
  getProfilePicUrl,
  changeStudentPassword,
  getStudentProfile
} from "../services/studentServices"

function ProfileModal({ user, onClose }) {

  const [profile, setProfile] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [imgRefresh, setImgRefresh] = useState(Date.now())
  const [hasProfilePic, setHasProfilePic] = useState(false)

  /* ================= FETCH STUDENT PROFILE ================= */
  useEffect(() => {
    if (user?.role === "student") {
      fetchProfile()
    }
  }, [user?.role])

  const fetchProfile = async () => {
    const token = sessionStorage.getItem("token")

    if (!token) {
      toast.error("Session expired. Please login again")
      return
    }

    const result = await getStudentProfile(token)

    if (result.status === "success") {
      setProfile(result.data)
    } else {
      toast.error(result.error || "Failed to load profile")
    }
  }

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warn("All fields are required")
      return
    }

    const token = sessionStorage.getItem("token")
    if (!token) {
      toast.error("Session expired. Please login again")
      return
    }

    const result = await changeStudentPassword(
      token,
      newPassword,
      confirmPassword
    )

    if (result.status === "success") {
      toast.success("Password changed")
      onClose()
    } else {
      toast.error(result.error || "Password change failed")
    }
  }

  /* ================= UPLOAD PROFILE PIC ================= */
  const uploadPic = async () => {
    if (!selectedFile) {
      toast.warn("Select an image first")
      return
    }

    if (selectedFile.size > 200 * 1024) {
      toast.error("Image must be under 200 KB")
      return
    }

    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      toast.error("Only JPG or PNG allowed")
      return
    }

    const token = sessionStorage.getItem("token")
    if (!token) {
      toast.error("Session expired. Please login again")
      return
    }

    const result = await uploadProfilePic(token, selectedFile)

    if (result.status === "success") {
      toast.success("Profile picture updated")
      setHasProfilePic(true)
      setImgRefresh(Date.now())
    } else {
      toast.error(result.error || "Upload failed")
    }
  }

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="profile-header">
          <h6 className="mb-0">Profile</h6>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* BODY */}
        <div className="profile-body text-center">

          {/* STUDENT PROFILE PIC (ONLY IF UPLOADED) */}
          {user.role === "student" && hasProfilePic && (
            <img
              src={`${getProfilePicUrl(user.email)}?t=${imgRefresh}`}
              alt="Profile"
              className="profile-avatar mb-3"
            />
          )}

          {/* UPLOAD CONTROLS (STUDENT ONLY) */}
          {user.role === "student" && (
            <>
              <input
                type="file"
                className="form-control mb-2"
                onChange={e => setSelectedFile(e.target.files[0])}
              />

              <button
                className="btn btn-outline-primary btn-sm mb-3"
                onClick={uploadPic}
              >
                Upload Photo
              </button>
            </>
          )}

          {/* PROFILE INFO */}
          <div className="profile-info text-start">
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email:</strong> {user.email}</p>

            {user.role === "student" && profile && (
              <>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Phone:</strong> {profile.mobile_no}</p>
              </>
            )}
          </div>

          {/* CHANGE PASSWORD (STUDENT ONLY) */}
          {user.role === "student" && (
            <>
              <hr />
              <h6 className="text-start">Change Password</h6>

              <input
                type="password"
                className="form-control mb-2"
                placeholder="New Password"
                onChange={e => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-2"
                placeholder="Confirm Password"
                onChange={e => setConfirmPassword(e.target.value)}
              />

              <button
                className="btn btn-primary w-100"
                onClick={changePassword}
              >
                Change Password
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProfileModal