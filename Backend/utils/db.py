import os
import mysql.connector

CA_PATH = os.path.join(os.path.dirname(__file__), "ca.pem")


def getConnection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_ca=CA_PATH,
        use_pure=True
    )