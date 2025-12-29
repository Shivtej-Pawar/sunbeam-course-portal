import axios from "axios";
import config from "./config";

// ===================== COURSES (PUBLIC) =====================
export async function getAllCourses(start_date,end_date) {
  let URL = config.BASE_URL + "/course/all-courses";

  if (start_date && end_date) {
    URL += `?start_date=${start_date}&end_date=${end_date}`;
  }

  const response = await axios.get(URL);
  return response.data;
}

// ===================== STUDENT =====================
export async function registerToCourse(name, email, courseId, mobileNo) {
  const URL = config.BASE_URL + "/student/register-to-course";
  const body = { name, email, courseId, mobileNo };

  try {
    const response = await axios.post(URL, body);
    return response.data;
  } catch (err) {
    // Axios puts backend response here for 4xx/5xx
    return err.response?.data || {
      status: 'error',
      error: 'Server error'
    };
  }
}


export async function getMyCourses(token) {
  const URL = config.BASE_URL + "/student/my-courses";

  const response = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// ===================== ADMIN =====================
export async function addCourses(course_name, description, fees, start_date, end_date, video_expire_days, token) {
  const URL = config.BASE_URL + "/course/add";
  const body = { course_name, description, fees, start_date, end_date, video_expire_days };
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post(URL, body, { headers });
  return response.data;
}

export async function deleteCourse(courseId, token) {
  const URL = config.BASE_URL + `/course/delete/${courseId}`;
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.delete(URL, { headers });
  return response.data;
}

export async function updateCourse(courseId, course_name, description, fees, start_date, end_date, video_expire_days, token) {
  const URL = config.BASE_URL + `/course/update/${courseId}`;
  const body = { course_name, description, fees, start_date, end_date, video_expire_days };
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.put(URL, body, { headers });
  return response.data;
}
