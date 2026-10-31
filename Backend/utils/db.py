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
        sql_mode="STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION",
        use_pure=True
    )


def executeQuery(sql, params=None):
    with getConnection() as con:
        with con.cursor(dictionary=True) as cur:
            if params:
                cur.execute(sql, params)
            else:
                cur.execute(sql)

            if cur.description:
                return cur.fetchall()
            else:
                con.commit()
                return {"affectedRows": cur.rowcount}