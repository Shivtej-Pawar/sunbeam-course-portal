from flask import Flask
from utils.util import enableJWT
from routes.course import courseRouter
from routes.users import userRouter
from routes.students import studentsRouter
from routes.videos import videosRouter
from routes.admin import adminRouter
from flask_cors import CORS


app = Flask(__name__)
enableJWT(app)
  
app.register_blueprint(userRouter)
app.register_blueprint(courseRouter)
app.register_blueprint(studentsRouter)
app.register_blueprint(videosRouter)
app.register_blueprint(adminRouter)
CORS(app)
    
      


@app.errorhandler(Exception)
def handle_exception(e):
    return {
        "status": "error",
        "message": str(e)
    }, 500   




if __name__ == "__main__":
     app.run(debug=True)
