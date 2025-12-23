from flask import jsonify
from flask_jwt_extended import JWTManager,create_access_token,jwt_required
from passlib.hash import sha256_crypt
crypto=sha256_crypt
import os
def createResult(error,data):
     if error is None:
          return jsonify(status="success",data=data)
     else:
          return jsonify(status="error",error=error)


def enableJWT(app):
        jwt_secret=os.getenv("MY_JWT_SECRET", "dev-secret")
        app.config['JWT_SECRET_KEY']=jwt_secret
        jwt_manager=JWTManager(app)
        
        @jwt_manager.invalid_token_loader
        def invalid_token_handeler(e):
          return createResult(f"Invalid JWT Token{e}",None),401

        @jwt_manager.unauthorized_loader
        def unauthorized_handler(e):
          return createResult("JWT Token is absent",None),401



