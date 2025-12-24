from flask import Blueprint, request
import utils.db as db
from utils.util import createResult
from flask_jwt_extended import jwt_required, get_jwt
adminRouter = Blueprint("admin", __name__, url_prefix="/admin")

@adminRouter.get("/enrolled-students")
@jwt_required()
def enrolled_students():
    claims=get_jwt()
    if claims.get("role")!="admin":
          return createResult("Not a Admin",None), 403
    courseId = request.args.get("courseId")

    sql = """
    SELECT s.reg_no, s.name, s.email, s.mobile_no, c.course_name
    FROM students s
    JOIN courses c ON s.course_id = c.course_id
    """

    params = None
    if courseId:
        sql += " WHERE s.course_id = %s"
        params = (courseId,)

    result = db.executeQuery(sql, params)
    return createResult(None, result)
