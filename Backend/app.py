from flask import Flask
from utils.util import enableJWT
from routes.course import courseRouter
from routes.users import userRouter
from flask_cors import CORS


app = Flask(__name__)
enableJWT(app)
  
app.register_blueprint(userRouter)
app.register_blueprint(courseRouter)
CORS(app)
    
      


@app.errorhandler(Exception)
def handle_exception(e):
    return {
        "status": "error",
        "message": str(e)
    }, 500   




if __name__ == "__main__":
     app.run(debug=True)
