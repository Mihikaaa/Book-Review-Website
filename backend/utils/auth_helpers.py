from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def hash_password(password):
    """
    Hash the given password.
    """
    return bcrypt.generate_password_hash(password).decode("utf-8")

def check_password(hashed_password, plain_password):
    """
    Check if the hashed password matches the plain password.
    """
    return bcrypt.check_password_hash(hashed_password, plain_password)

