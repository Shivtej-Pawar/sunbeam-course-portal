from flask import Flask
from utils.util import enableJWT
from routes.course import courseRouter
from routes.users import userRouter
from routes.students import studentsRouter
from routes.videos import videosRouter
from routes.admin import adminRouter
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 300 * 1024  # 300 KB

# JWT
enableJWT(app)

# CORS
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)

# Routes
app.register_blueprint(userRouter)
app.register_blueprint(courseRouter)
app.register_blueprint(studentsRouter)
app.register_blueprint(videosRouter)
app.register_blueprint(adminRouter)

# Error handler (FIXED)
@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return e

    print("Unhandled Exception:", e)
    return {
        "status": "error",
        "message": str(e)
    }, 500

if __name__ == "__main__":
    app.run(debug=True)
