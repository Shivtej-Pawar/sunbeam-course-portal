import axios from "axios";
import config from "./config";

export async function getAllVideos(courseId) {
  let url = config.BASE_URL + "/video/all-videos";
  if (courseId) {
    url += `?courseId=${courseId}`;
  }
  const response = await axios.get(url);
  return response.data;
}


// ================= ADD VIDEO (ADMIN) =================
export async function addVideo(
  courseId,
  title,
  youtube_url,
  description,
  token
) {
  const response = await axios.post(
    config.BASE_URL + "/video/add",
    {
      courseId,
      title,
      youtube_url,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

// ================= DELETE VIDEO (ADMIN) =================
export async function deleteVideo(videoId, token) {
  const response = await axios.delete(
    config.BASE_URL + `/video/delete/${videoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
export async function updateVideo(
  videoId,
  courseId,
  title,
  youtube_url,
  description,
  token
) {
  const response = await axios.put(
    config.BASE_URL + `/video/update/${videoId}`,
    {
      courseId,
      title,
      youtube_url,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
