import os

class Config:
    SECRET_KEY = "5f795f3d46b03f2355fb061cd5c4f459"
    MONGO_URI = "mongodb://localhost:27017/book_review_db"

    # Flask-Session settings
    SESSION_TYPE = "filesystem"  # Stores session data in the file system
    SESSION_PERMANENT = False    # Sessions expire when the browser is closed
    SESSION_USE_SIGNER = True    # Adds extra security for session cookies
