  import axios from "axios";
  import config from "./config";

  /* ================= GET ENROLLED STUDENTS ================= */
  export async function getEnrolled_students(courseId, token) {
    const URL = config.BASE_URL + "/admin/enrolled-students";
    const headers = { Authorization: `Bearer ${token}` };
    const params = courseId ? { courseId } : {};

    const response = await axios.get(URL, { headers, params });
    return response.data;
  }

  /* ================= CHANGE PASSWORD ================= */
  export const changeStudentPassword = async (
    token,
    newPassword,
    confirmPassword
  ) => {
    try {
      const res = await axios.put(
        config.BASE_URL + "/students/change-password",
        { newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return err.response?.data || { status: "error" };
    }
  };

  /* ================= UPLOAD PROFILE PIC ================= */
  export const uploadProfilePic = async (token, file) => {
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.put(
        config.BASE_URL + "/students/upload-profile-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return err.response?.data || { status: "error" };
    }
  };

  /* ================= PROFILE PIC URL ================= */
  export const getProfilePicUrl = (email) => {
    return config.BASE_URL + `/student/profile-pic/${email}`;
  };

  export const getStudentProfile = async (token) => {
    try {
      const res = await axios.get(
        config.BASE_URL + "/student/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return res.data
    } catch (err) {
      return err.response?.data || { status: "error" }
    }
  }
