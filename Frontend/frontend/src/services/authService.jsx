import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:5000/users/auth/login'

export const studentLogin = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/student`, {
      email,
      password
    })
    return res.data
  } catch (err) {
    return err.response?.data || { status: 'error', error: 'Server error' }
  }
}

export const adminLogin = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/admin`, {
      email,
      password
    })
    return res.data
  } catch (err) {
    return err.response?.data || { status: 'error', error: 'Server error' }
  }
}
