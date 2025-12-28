import axios from 'axios'
import config from './config'

export async function getAllCourses(start_date,end_date)
{
   const URL=config.BASE_URL+`/course/all-courses?start_date=${start_date}&end_date=${end_date}`
   const response=await axios.get(URL)
   return response.data
}

export async function registerToCourse(name,email,courseId,mobileNo)
{
   const URL=config.BASE_URL+'/student/register-to-course'
   const body={name,email,courseId,mobileNo}
   const response=await axios.post(URL,body)
   return response.data
}

export async function addCourses(course_name,description,fees,start_date,end_date,video_expire_days,token)
{     
     const URL=config.BASE_URL+'/course/add';
     const headers={Authorization:`Bearer ${token}`}
     const body={course_name,description,fees,start_date,end_date,video_expire_days}
     const response=await axios.post(URL,body,{headers})
     return response.data
}

export async function deleteCourse(courseId,token)
{
   const URL=config.BASE_URL+`/course/delete/${courseId}`
   const headers={Authorization:`Bearer ${token}`}   
   const response=await axios.delete(URL,{headers})
   return response.data
}

// http://127.0.0.1:5000/course/update/20

export async function updateCourse(courseId,course_name,description,fees,start_date,end_date,video_expire_days,token)
{
   const URL=config.BASE_URL+`/course/update/${courseId}`    
   const headers={Authorization:`Bearer ${token}`}
   const body={course_name,description,fees,start_date,end_date,video_expire_days}
   const response=await axios.put(URL,body,{headers})
   return response.data;
}