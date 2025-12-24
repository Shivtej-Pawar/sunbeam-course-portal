from flask import Blueprint, request
from passlib.hash import sha256_crypt
import utils.db as db
from utils.util import createResult,crypto
from flask_jwt_extended import jwt_required, get_jwt
studentsRouter = Blueprint("students", __name__, url_prefix="/student")



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
    claims=get_jwt()
    if claims.get("role")!="student":
          return createResult("Not A Student",None), 403
    data = request.json
    if data["newPassword"] != data["confirmPassword"]:
        return createResult("Passwords do not match", None)

    hashed = sha256_crypt.hash(data["newPassword"])

    sql = "UPDATE users SET password=%s WHERE email=%s"
    params = (hashed, data["email"])

    result = db.executeQuery(sql, params)
    return createResult(None, result)

@studentsRouter.get("/my-courses")
@jwt_required()
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
@jwt_required()
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
