from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
import utils.db as db
from utils.util import createResult

videosRouter = Blueprint("videos", __name__, url_prefix="/video")

@videosRouter.route("/all-videos", methods=["GET"])
def get_all_videos():
    courseId = request.args.get("courseId")

    if courseId:
        sql = "SELECT * FROM videos WHERE course_id=%s"
        result = db.executeQuery(sql, (courseId,))
    else:
        sql = "SELECT * FROM videos"
        result = db.executeQuery(sql)

    return createResult(None, result)



# ================= ADD VIDEO (ADMIN ONLY) =================
@videosRouter.route("/add", methods=["POST"])
@jwt_required()
def add_video():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return createResult("Admin access required", None), 403

    data = request.json

    sql = """
    INSERT INTO videos (course_id, title, youtube_url, description)
    VALUES (%s, %s, %s, %s)
    """

    params = (
        data["courseId"],
        data["title"],
        data["youtube_url"],
        data["description"]
    )

    result = db.executeQuery(sql, params)
    return createResult(None, result)

@videosRouter.route("/update/<int:videoId>", methods=["PUT"])
@jwt_required()
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
        data["youtube_url"],
        data["description"],
        videoId
    )

    return createResult(None, db.executeQuery(sql, params))


# ================= DELETE VIDEO (ADMIN ONLY) =================
@videosRouter.route("/delete/<int:videoId>", methods=["DELETE"])
@jwt_required()
def delete_video(videoId):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return createResult("Admin access required", None), 403

    sql = "DELETE FROM videos WHERE video_id=%s"
    result = db.executeQuery(sql, (videoId,))
    return createResult(None, result)
