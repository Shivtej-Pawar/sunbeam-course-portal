from flask import Blueprint, request
from passlib.hash import sha256_crypt
import utils.db as db
from utils.util import createResult, crypto
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

studentsRouter = Blueprint("students", __name__, url_prefix="/students")



@studentsRouter.post("/register-to-course")
def register_student():
    data = request.json
    email = data["email"]

    check_sql = "SELECT email FROM users WHERE email=%s"
    existing_user = db.executeQuery(check_sql, (email,))
    if len(existing_user) == 0:
        default_password = "Student@123"
        enc_pwd = crypto.hash(default_password)
        user_sql = "INSERT INTO users(email, password, role) VALUES (%s, %s, %s)"
        user_params = (email, enc_pwd, "student")
        db.executeQuery(user_sql, user_params)

    student_sql = """
        INSERT INTO students(name, email, course_id, mobile_no)
        VALUES (%s, %s, %s, %s)
    """
    student_params = (
        data["name"],
        data["email"],
        data["courseId"],
        data["mobileNo"]
    )
    result = db.executeQuery(student_sql, student_params)
    return createResult(None, result)


@studentsRouter.put("/change-password")
@jwt_required()
def change_password():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not A Student", None), 403

    data = request.json
    if data["newPassword"] != data["confirmPassword"]:
        return createResult("Passwords do not match", None)

    hashed = sha256_crypt.hash(data["newPassword"])
    email = get_jwt_identity()

    sql = "UPDATE users SET password=%s WHERE email=%s"
    params = (hashed, email)

    result = db.executeQuery(sql, params)
    return createResult(None, result)


@studentsRouter.get("/my-courses")
@jwt_required()
def my_courses():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not A Student", None), 403

    email = get_jwt_identity()

    sql = """
    SELECT c.*
    FROM courses c
    JOIN students s ON c.course_id = s.course_id
    WHERE s.email = %s
    """

    result = db.executeQuery(sql, (email,))
    return createResult(None, result)


@studentsRouter.get("/my-course-with-videos")
@jwt_required()
def my_course_with_videos():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not A Student", None), 403

    email = get_jwt_identity()

    sql = """
    SELECT c.course_id, c.course_name,
           v.video_id, v.title, v.youtube_url, v.description
    FROM courses c
    JOIN students s ON c.course_id = s.course_id
    JOIN videos v ON c.course_id = v.course_id
    WHERE s.email = %s
    ORDER BY c.course_id, v.video_id
    """

    result = db.executeQuery(sql, (email,))
    return createResult(None, result)

from flask import send_file
import io

@studentsRouter.put("/upload-profile-pic")
@jwt_required()
def upload_profile_pic():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not A Student", None), 403

    if 'profilePic' not in request.files:
        return createResult("No file uploaded", None), 400

    file = request.files['profilePic']
    img_bytes = file.read()

    email = get_jwt_identity()

    sql = "UPDATE students SET profile_pic=%s WHERE email=%s"
    params = (img_bytes, email)

    result = db.executeQuery(sql, params)
    return createResult(None, result)


from flask import send_file
import io

@studentsRouter.get("/profile-pic/<email>")
def get_profile_pic(email):
    sql = "SELECT profile_pic FROM students WHERE email=%s"
    result = db.executeQuery(sql, (email,))

    if len(result) == 0 or result[0]["profile_pic"] is None:
        return "", 404

    img_bytes = result[0]["profile_pic"]

    return send_file(
        io.BytesIO(img_bytes),
        mimetype="image/jpeg"
    )
