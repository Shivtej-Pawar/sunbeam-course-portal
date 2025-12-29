import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllVideos } from "../services/videoServices";

function Videos() {
  const { courseId } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const result = await getAllVideos(courseId);
    if (result.status === "success") {
      setVideos(result.data);
    } else {
      toast.error("Failed to load videos");
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4">Course Videos</h3>

      {videos.length === 0 && (
        <div className="text-muted">No videos available</div>
      )}

      {videos.map((v, index) => (
        <div key={v.video_id} className="card mb-3">
          <div className="card-body">
            <h6>{index + 1}. {v.title}</h6>
            <p>{v.description}</p>
            <a
              href={v.youtube_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-info btn-sm"
            >
              Play Video
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Videos;
