import axios from "axios";
import config from "./config";


export async function getAllCourses(start_date = "", end_date = "") {
  let URL = config.BASE_URL + "/course/all-courses";

  if (start_date && end_date) {
    URL += `?start_date=${start_date}&end_date=${end_date}`;
  }

  const response = await axios.get(URL);
  return response.data; 
}
export async function registerToCourse(name, email, courseId, mobileNo) {
  const URL = config.BASE_URL + "/student/register-to-course";

  const body = {
    name,
    email,
    courseId,
    mobileNo,
  };

  const response = await axios.post(URL, body);
  return response.data;
}
export async function getMyCourses(token) {
  const response = await axios.get(
    config.BASE_URL + "/student/my-courses",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
