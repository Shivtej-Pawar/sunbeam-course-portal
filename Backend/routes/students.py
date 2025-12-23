from flask import Blueprint, request
from passlib.hash import sha256_crypt
import utils.db as db
from utils.util import createResult

studentsRouter = Blueprint("students", __name__, url_prefix="/student")

@studentsRouter.post("/register-to-course")
def register_student():
    data = request.json

    sql = """
    INSERT INTO students(name, email, course_id, mobile_no)
    VALUES (%s, %s, %s, %s)
    """
    params = (
        data["name"],
        data["email"],
        data["courseId"],
        data["mobileNo"]
    )

    result = db.executeQuery(sql, params)
    return createResult(None, result)

@studentsRouter.put("/change-password")
def change_password():
    data = request.json

    if data["newPassword"] != data["confirmPassword"]:
        return createResult("Passwords do not match", None)

    hashed = sha256_crypt.hash(data["newPassword"])

    sql = "UPDATE users SET password=%s WHERE email=%s"
    params = (hashed, data["email"])

    result = db.executeQuery(sql, params)
    return createResult(None, result)

@studentsRouter.get("/my-courses")
def my_courses():
    email = request.args.get("email")

    sql = """
    SELECT c.*
    FROM courses c
    JOIN students s ON c.course_id = s.course_id
    WHERE s.email = %s
    """
    result = db.executeQuery(sql, (email,))
    return createResult(None, result)

@studentsRouter.get("/my-course-with-videos")
def my_course_with_videos():
    email = request.args.get("email")

    sql = """
    SELECT c.course_id, c.course_name,
           v.video_id, v.title, v.youtube_url
    FROM courses c
    JOIN students s ON c.course_id = s.course_id
    JOIN videos v ON c.course_id = v.course_id
    WHERE s.email = %s
    """
    result = db.executeQuery(sql, (email,))
    return createResult(None, result)
