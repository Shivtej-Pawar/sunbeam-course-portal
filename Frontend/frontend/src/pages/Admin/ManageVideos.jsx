import { useEffect, useState } from "react";
import "./ManageVideos.css";
import { toast } from "react-toastify";

import {
  getAllVideos,
  addVideo,
  deleteVideo,
  updateVideo
} from "../../services/videoServices";

import { getAllCourses } from "../../services/courseServices";

function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [youtube_url, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [editVideoId, setEditVideoId] = useState(null);

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, []);

  const fetchVideos = async () => {
    const result = await getAllVideos();
    if (result.status === "success") setVideos(result.data);
  };

  const fetchCourses = async () => {
    const result = await getAllCourses();
    if (result.status === "success") setCourses(result.data);
  };

  // ✅ FIXED FUNCTION
  const insertVideo = async () => {
    if (!courseId) return toast.warn("Select course");
    if (!title) return toast.warn("Enter title");
    if (!youtube_url) return toast.warn("Enter YouTube URL");

    const token = sessionStorage.getItem("token");
    if (!token) return toast.error("Login again as admin");

    try {
      const result = editVideoId
        ? await updateVideo(
            editVideoId,
            courseId,
            title,
            youtube_url,
            description,
            token
          )
        : await addVideo(
            courseId,
            title,
            youtube_url,
            description,
            token
          );

      if (result.status === "success") {
        toast.success(editVideoId ? "Video updated" : "Video added");
        resetForm();
        fetchVideos();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unauthorized or server error");
    }
  };

  const trashVideo = async (videoId) => {
    const token = sessionStorage.getItem("token");
    const result = await deleteVideo(videoId, token);

    if (result.status === "success") {
      toast.success("Video deleted");
      fetchVideos();
    } else {
      toast.error(result.error);
    }
  };

  const editVideo = (video) => {
    setEditVideoId(video.video_id);
    setCourseId(video.course_id);
    setTitle(video.title);
    setYoutubeUrl(video.youtube_url);
    setDescription(video.description);
  };

  const resetForm = () => {
    setEditVideoId(null);
    setCourseId("");
    setTitle("");
    setYoutubeUrl("");
    setDescription("");
  };

  return (
    <div className="container-fluid manage-videos py-4">
      <div className="row g-4">

        {/* VIDEO LIST */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header section-title">
              Manage Videos
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course</th>
                    <th>Title</th>
                    <th>Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((v) => (
                    <tr key={v.video_id}>
                      <td className="text-center">{v.video_id}</td>
                      <td>{v.course_id}</td>
                      <td>{v.title}</td>
                      <td className="text-center">
                        <a href={v.youtube_url} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </td>
                      <td className="action-btns">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => editVideo(v)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => trashVideo(v.video_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {videos.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No videos available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ADD / EDIT VIDEO */}
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header section-title">
              {editVideoId ? "Edit Video" : "Add New Video"}
            </div>

            <div className="card-body">
              <label className="form-label">Course</label>
              <select
                className="form-select mb-3"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.course_id} value={c.course_id}>
                    {c.course_name}
                  </option>
                ))}
              </select>

              <label className="form-label">Title</label>
              <input
                className="form-control mb-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="form-label">YouTube URL</label>
              <input
                className="form-control mb-3"
                value={youtube_url}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />

              <label className="form-label">Description</label>
              <textarea
                className="form-control mb-3"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-info text-white"
                  onClick={insertVideo}
                >
                  {editVideoId ? "Update Video" : "Add Video"}
                </button>

                {editVideoId && (
                  <button
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ManageVideos;
