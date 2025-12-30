from passlib.hash import sha256_crypt
hashed_pwd = sha256_crypt.hash("Admin@123")
print(hashed_pwd)
