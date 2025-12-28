import axios from "axios";
import config from './config';

export const studentLogin = async (email, password) => {
  try {
    const URL=config.BASE_URL+'/users/auth/login/student'
    const res = await axios.post(URL, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    return err.response?.data || {
      status: "error",
      error: "Server error",
    };
  }
};
// http://127.0.0.1:5000/users/auth/login/admin
export const adminLogin = async (email, password) => {
  try {
    const res = await axios.post(config.BASE_URL+'/users/auth/login/admin', {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    return err.response?.data || {
      status: "error",
      error: "Server error",
    };
  }
};

