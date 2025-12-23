from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import utils.db as db
from utils.util import createResult

courseRouter=Blueprint("course",__name__,url_prefix="/course")

# @app.get("/course/all-courses")
@courseRouter.get('/all-courses')
@jwt_required()
def getAllcourses():
     sql="SELECT *FROM courses  where start_date=%s and end_date=%s;"
     start_date = request.args.get("start_date")
     end_date = request.args.get("end_date")
     params=(start_date,end_date)
     result=db.executeQuery(sql,params)
     return createResult(None,result)



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
     sql = "DELETE FROM courses WHERE course_id=%s"
     result=db.executeQuery(sql,(courseId,))
     return createResult(None,result)




@courseRouter.get("/all-active-courses")
@jwt_required()
def getActiveCourses():
    sql = "SELECT *FROM courses WHERE CURDATE() BETWEEN start_date AND end_date"
    result = db.executeQuery(sql,None)
    return createResult(None, result)
