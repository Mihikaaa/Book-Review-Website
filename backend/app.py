from flask import Flask, jsonify
from flask_cors import CORS
from flask_session import Session
from pymongo import MongoClient
from config import Config


app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS with proper configuration

CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,  # Required for cookies/session handling
)
# Enable Flask-Session
Session(app)

# MongoDB client setup
client = MongoClient(app.config["MONGO_URI"])
db = client.get_database()

# Add the db object to the app's config so it can be accessed via `current_app`
app.config["db"] = db

# Import and register routes
from routes.auth_routes import auth_bp
from routes.review_routes import review_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(review_bp, url_prefix="/api/reviews")

# Default route
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Book Review API!"}), 200

if __name__ == "__main__":
    app.run(debug=True)

@app.route("/test-cors", methods=["OPTIONS", "POST"])
def test_cors():
    return jsonify({"message": "CORS is working!"}), 200
