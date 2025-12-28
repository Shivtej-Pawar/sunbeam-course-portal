import axios from "axios";
import config from "./config";

export async function getEnrolled_students(courseId,token)
{
      const URL=config.BASE_URL+'/admin/enrolled-students'      
      const headers={Authorization:`Bearer ${token}`}
      const params = courseId ? { courseId } : {}
      const response=await axios.get(URL,{headers,params})
      return response.data
}