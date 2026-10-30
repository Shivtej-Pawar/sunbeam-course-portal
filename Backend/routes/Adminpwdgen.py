from passlib.hash import sha256_crypt
pwd=input("Enter password:")
hashed_pwd = sha256_crypt.hash(pwd)
print(hashed_pwd)
