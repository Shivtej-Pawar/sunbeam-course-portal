import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  uploadProfilePic,
  getProfilePicUrl,
  changeStudentPassword
} from '../services/studentServices'

function ProfileModal({ user, onClose }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imgRefresh, setImgRefresh] = useState(Date.now())

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warn('All fields are required')
      return
    }

    const result = await changeStudentPassword(
      user.token,
      newPassword,
      confirmPassword
    )

    if (result.status === 'success') {
      toast.success('Password changed')
      onClose()
    } else {
      toast.error(result.error || 'Password change failed')
    }
  }

  const uploadPic = async () => {
  if (!selectedFile) {
    toast.warn('Select an image first')
    return
  }

  // ✅ SIZE CHECK (200 KB)
  if (selectedFile.size > 200 * 1024) {
    toast.error('Image must be under 200 KB')
    return
  }

  // ✅ MIME TYPE CHECK (real format, not extension)
  if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
    toast.error('Only JPG or PNG images allowed')
    return
  }

  const result = await uploadProfilePic(user.token, selectedFile)

  if (result.status === 'success') {
    toast.success('Profile picture updated')
    setImgRefresh(Date.now())
  } else {
    toast.error(result.error || 'Upload failed')
  }
}


  return (
    <div className="modal fade show d-block profile-modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Profile</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body text-center">

            {user.role === 'student' && (
              <>
                <img
                  src={`${getProfilePicUrl(user.email)}?t=${imgRefresh}`}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  width="120"
                  height="120"
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
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

            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email:</strong> {user.email}</p>

            {user.role === 'student' && (
              <>
                <hr />
                <h6>Change Password</h6>

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
    </div>
  )
}

export default ProfileModal
