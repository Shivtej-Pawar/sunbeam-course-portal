import mysql.connector

def getConnection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="shivtej",
        database="course_portal",
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