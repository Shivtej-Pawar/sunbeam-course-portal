from flask import Blueprint, request
import utils.db as db
from utils.util import createResult

videosRouter = Blueprint("videos", __name__, url_prefix="/video")

@videosRouter.get("/all-videos")
def get_all_videos():
    courseId = request.args.get("courseId")

    if courseId:
        sql = "SELECT * FROM videos WHERE course_id = %s"
        result = db.executeQuery(sql, (courseId,))
    else:
        sql = "SELECT * FROM videos"
        result = db.executeQuery(sql)

    return createResult(None, result)

@videosRouter.post("/add")
def add_video():
    data = request.json

    sql = """
    INSERT INTO videos(course_id, title, youtube_url, description)
    VALUES (%s, %s, %s, %s)
    """
    params = (
        data["courseId"],
        data["title"],
        data["youtubeURL"],
        data["description"]
    )

    result = db.executeQuery(sql, params)
    return createResult(None, result)

@videosRouter.put("/update/<int:videoId>")
def update_video(videoId):
    data = request.json

    sql = """
    UPDATE videos
    SET course_id=%s, title=%s, youtube_url=%s, description=%s
    WHERE video_id=%s
    """
    params = (
        data["courseId"],
        data["title"],
        data["youtubeURL"],
        data["description"],
        videoId
    )

    result = db.executeQuery(sql, params)
    return createResult(None, result)

@videosRouter.delete("/delete/<int:videoId>")
def delete_video(videoId):
    sql = "DELETE FROM videos WHERE video_id = %s"
    result = db.executeQuery(sql, (videoId,))
    return createResult(None, result)
