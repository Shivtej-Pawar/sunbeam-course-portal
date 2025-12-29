from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import utils.db as db
from utils.util import createResult

courseRouter=Blueprint("course",__name__,url_prefix="/course")

@courseRouter.get("/all-courses")
def getAllCourses():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    sql = """
    SELECT 
        c.*,
        COUNT(s.email) AS student_count
    FROM courses c
    LEFT JOIN students s ON c.course_id = s.course_id
    """
    params = []

    if start_date and end_date:
        sql += " WHERE c.start_date = %s AND c.end_date = %s"
        params.extend([start_date, end_date])

    sql += " GROUP BY c.course_id"

    result = db.executeQuery(sql, tuple(params))
    return createResult(None, result)






@courseRouter.post("/add")
@jwt_required()
def addCourse():
     claims=get_jwt()
     if claims.get("role")!="admin":
          return createResult("Not a Admin",None), 403

     sql= "INSERT INTO courses(course_name, description, fees, start_date, end_date, video_expire_days)VALUES (%s, %s, %s, %s, %s, %s)"
     params = (
                request.json["course_name"],
                request.json["description"],
                request.json["fees"],
                request.json["start_date"],
                request.json["end_date"],
                request.json["video_expire_days"],
              )      
     result=db.executeQuery(sql,params)
     return createResult(None,result)



@courseRouter.put("/update/<int:courseId>")
@jwt_required()
def updateCourse(courseId):
     claims=get_jwt()
     if claims.get("role")!="admin":
          return createResult("Not a Admin",None), 403
     sql="UPDATE courses SET course_name=%s,description=%s,fees=%s,start_date=%s,end_date=%s, video_expire_days=%s WHERE course_id=%s"
     params = (
        request.json["course_name"],
        request.json["description"],
        request.json["fees"],
        request.json["start_date"],
        request.json["end_date"],
        request.json["video_expire_days"],
        courseId)
     result=db.executeQuery(sql,params)
     return createResult(None,result)


@courseRouter.delete("/delete/<int:courseId>")
@jwt_required()
def deleteCourse(courseId):
     claims=get_jwt()
     if claims.get("role")!="admin":
          return createResult("Not a Admin",None), 403
     db.executeQuery('DELETE FROM students WHERE course_id=%s',(courseId,))
     db.executeQuery("DELETE FROM videos WHERE course_id=%s",(courseId,))
     result=db.executeQuery("DELETE FROM courses WHERE course_id=%s",(courseId,))
     if result==0:
          createResult("Course not found",None), 404
     
     return createResult(None,result)


@courseRouter.get("/all-active-courses")
def getActiveCourses():
    sql = "SELECT *FROM courses WHERE CURDATE() BETWEEN start_date AND end_date"
    result = db.executeQuery(sql,None)
    return createResult(None, result)
