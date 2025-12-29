from flask import Blueprint, request, send_file
from passlib.hash import sha256_crypt
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
import utils.db as db
from utils.util import createResult, crypto
import io

studentsRouter = Blueprint("student", __name__, url_prefix="/student")

# ================= REGISTER STUDENT =================
@studentsRouter.post("/register-to-course")
def register_student():
    try:
        data = request.json
        email = data["email"]

        # Create user if not exists
        check_sql = "SELECT email FROM users WHERE email=%s"
        existing_user = db.executeQuery(check_sql, (email,))

        if len(existing_user) == 0:
            default_password = "Student@123"
            enc_pwd = crypto.hash(default_password)
            user_sql = """
                INSERT INTO users(email, password, role)
                VALUES (%s, %s, %s)
            """
            db.executeQuery(user_sql, (email, enc_pwd, "student"))

        #  Register student to course
        student_sql = """
            INSERT INTO students(name, email, course_id, mobile_no)
            VALUES (%s, %s, %s, %s)
        """
        params = (
            data["name"],
            data["email"],
            data["courseId"],
            data["mobileNo"]
        )

        db.executeQuery(student_sql, params)

        return createResult(None, "Registered successfully")

    except Exception as e:
        #  duplicate registration
        if "Duplicate entry" in str(e):
            return createResult("ALREADY_REGISTERED", None), 409

        return createResult(str(e), None), 500


# ================= CHANGE PASSWORD =================
@studentsRouter.put("/change-password")
@jwt_required()
def change_password():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not A Student", None), 403

    data = request.json
    if data["newPassword"] != data["confirmPassword"]:
        return createResult("Passwords do not match", None), 400

    email = get_jwt_identity()
    hashed = sha256_crypt.hash(data["newPassword"])

    sql = "UPDATE users SET password=%s WHERE email=%s"
    result = db.executeQuery(sql, (hashed, email))
    return createResult(None, result)

# ================= MY COURSES =================
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

# ================= MY COURSE WITH VIDEOS =================
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

# ================= UPLOAD PROFILE PIC =================
@studentsRouter.put("/upload-profile-pic")
@jwt_required()
def upload_profile_pic():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not A Student", None), 403

    if "profilePic" not in request.files:
        return createResult("No file uploaded", None), 400

    file = request.files["profilePic"]
    img_bytes = file.read()
    email = get_jwt_identity()

    sql = "UPDATE students SET profile_pic=%s WHERE email=%s"
    result = db.executeQuery(sql, (img_bytes, email))
    return createResult(None, result)

# ================= GET PROFILE PIC =================
@studentsRouter.get("/profile-pic/<email>")
def get_profile_pic(email):
    sql = "SELECT profile_pic FROM students WHERE email=%s"
    result = db.executeQuery(sql, (email,))

    if len(result) == 0 or result[0]["profile_pic"] is None:
        return "", 404

    return send_file(
        io.BytesIO(result[0]["profile_pic"]),
        mimetype="image/jpeg"
    )

# ================= GET STUDENT PROFILE =================
@studentsRouter.get("/profile")
@jwt_required()
def get_profile():
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Unauthorized", None), 403

    email = get_jwt_identity()   # ✅ CORRECT & SAFE

    sql = """
        SELECT name, email, mobile_no
        FROM students
        WHERE email = %s
    """
    result = db.executeQuery(sql, (email,))
    return createResult(None, result[0])


@studentsRouter.get("/is-registered/<int:courseId>")
@jwt_required()
def is_registered(courseId):
    claims = get_jwt()
    if claims.get("role") != "student":
        return createResult("Not a student", None), 403

    email = get_jwt_identity()

    sql = """
        SELECT 1 FROM students
        WHERE email = %s AND course_id = %s
    """
    result = db.executeQuery(sql, (email, courseId))

    return createResult(None, {"registered": len(result) > 0})