from flask import Blueprint, request
from flask_jwt_extended import create_access_token
import utils.db as db
from utils.util import createResult, crypto

userRouter = Blueprint("users", __name__, url_prefix="/users")




@userRouter.post("/auth/login/student")
def studentLogin():
    email = request.json["email"]
    password = request.json["password"]

    sql = "SELECT * FROM users WHERE email=%s AND role='student'"
    result = db.executeQuery(sql, (email,))

    if len(result) == 0:
        return createResult("Invalid email or password", None), 401

    user = result[0]

    if not crypto.verify(password, user["password"]):
        return createResult("Invalid email or password", None), 401

    token = create_access_token(
        identity=email,
        additional_claims={"role": "student"}
    )

    user["password"] = "*****"
    user["token"] = token

    return createResult(None, user)


@userRouter.post("/auth/login/admin")
def adminLogin():
    email = request.json["email"]
    password = request.json["password"]

    sql = "SELECT * FROM users WHERE email=%s AND role='admin'"
    result = db.executeQuery(sql, (email,))

    if len(result) == 0:
        return createResult("Invalid email or password", None), 401

    user = result[0]

    if not crypto.verify(password, user["password"]):
        return createResult("Invalid email or password", None), 401

    token = create_access_token(
        identity=email,
        additional_claims={"role": "admin"}
    )

    user["password"] = "*****"
    user["token"] = token

    return createResult(None, user)
