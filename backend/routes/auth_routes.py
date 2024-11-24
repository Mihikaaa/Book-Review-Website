from flask import Blueprint, request, jsonify, session, current_app
from utils.auth_helpers import hash_password, check_password
from models.user_model import create_user, get_user_collection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Handles user registration.
    """
    try:
        # Parse the JSON data from the request
        data = request.get_json()

        # Extract fields from the JSON data
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        # Validate required fields
        if not username or not password or not confirm_password:
            return jsonify({"error": "All fields (username, password, confirm_password) are required"}), 400

        # Check if passwords match
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        # Access the MongoDB instance
        db = current_app.config["db"]
        user_collection = get_user_collection(db)

        # Check if the username already exists
        existing_user = user_collection.find_one({"username": username})
        if existing_user:
            return jsonify({"error": "Username already exists"}), 400

        # Hash the password and save the user to the database
        hashed_password = hash_password(password)
        create_user(user_collection, username, hashed_password)

        # Return success response
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        # Handle unexpected errors and log them
        print(f"Error during registration: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Handles user login.
    """
    try:
        # Parse the JSON data from the request
        data = request.get_json()

        # Extract fields
        username = data.get("username")
        password = data.get("password")

        # Validate required fields
        if not username or not password:
            return jsonify({"error": "Both username and password are required"}), 400

        # Access the MongoDB instance
        db = current_app.config["db"]
        user_collection = get_user_collection(db)

        # Find the user in the database
        user = user_collection.find_one({"username": username})
        if not user:
            return jsonify({"error": "Invalid username or password"}), 401

        # Verify the password
        if not check_password(user["password"], password):
            return jsonify({"error": "Invalid username or password"}), 401

        # Store the user's username in the session
        session["username"] = username

        # Return success response
        return jsonify({"message": "Login successful!", "username": username}), 200

    except Exception as e:
        # Handle unexpected errors and log them
        print(f"Error during login: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@auth_bp.route("/me", methods=["GET"])
def get_user_details():
    """
    Retrieves details of the logged-in user.
    """
    try:
        # Check if the user is logged in
        if "username" not in session:
            return jsonify({"error": "User not logged in"}), 401

        # Return the logged-in username
        return jsonify({"username": session["username"]}), 200

    except Exception as e:
        # Handle unexpected errors and log them
        print(f"Error during user details retrieval: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Handles user logout.
    """
    try:
        # Clear the session
        session.clear()
        return jsonify({"message": "Logged out successfully"}), 200

    except Exception as e:
        # Handle unexpected errors and log them
        print(f"Error during logout: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500
