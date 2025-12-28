import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:5000/students'

/* ========== CHANGE PASSWORD ========== */
export const changeStudentPassword = async (
  token,
  newPassword,
  confirmPassword
) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/change-password`,
      { newPassword, confirmPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (err) {
    return err.response?.data || { status: 'error' }
  }
}

/* ========== UPLOAD PROFILE PIC ========== */
export const uploadProfilePic = async (token, file) => {
  const formData = new FormData()
  formData.append('profilePic', file)

  try {
    const res = await axios.put(
      `${BASE_URL}/upload-profile-pic`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return res.data
  } catch (err) {
    return err.response?.data || { status: 'error' }
  }
}

/* ========== PROFILE PIC URL ========== */
export const getProfilePicUrl = (email) => {
  return `${BASE_URL}/profile-pic/${email}`
}
