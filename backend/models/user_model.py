def get_user_collection(db):
    """
    Returns the user collection from the MongoDB database.
    """
    return db["users"]

def create_user(user_collection, username, hashed_password):
    """
    Inserts a new user into the user collection.
    """
    user = {
        "username": username,
        "password": hashed_password
    }
    return user_collection.insert_one(user)
