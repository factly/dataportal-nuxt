from passlib.hash import pbkdf2_sha512
import sys
# Takes first name and last name via command
# line arguments and then display them
def verify():
    password = "12345678"
    hashStr = "$pbkdf2-sha512$25000$/z.n1BojxPgfI2RMibEWYg$0HZ5pMHE69SoPWOpPO4oKyeX0uN/w.lEqKXfgNBg8bsxX8lq77ZfpCB4AIjjhe.bmSr4RLLFP/QS6WszUigC.g"
    print(pbkdf2_sha512.verify(password, hashStr))
    sys.stdout.flush()

if __name__ == '__main__':
    verify()