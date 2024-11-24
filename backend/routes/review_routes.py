from flask import Blueprint, request, jsonify, current_app
from models.review_model import (
    get_review_collection,
    get_next_review_id,
    create_review,
    fetch_reviews,
    update_review,
    delete_review
)
from datetime import datetime

review_bp = Blueprint("reviews", __name__)

@review_bp.route("/", methods=["POST"])
def add_review():
    """
    Add a new review to the database.
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not all(key in data for key in ("title", "author", "content", "rating")):
            return jsonify({"error": "All fields (title, author, content, rating) are required"}), 400

        # Access the db object
        db = current_app.config["db"]
        review_collection = get_review_collection(db)

        # Generate the next review_id
        review_id = get_next_review_id(db)

        # Prepare review data
        review_data = {
            "review_id": review_id,
            "title": data["title"],
            "author": data["author"],
            "content": data["content"],
            "rating": data["rating"],
            "date": datetime.utcnow(),
        }

        # Save the review to the database
        create_review(review_collection, review_data)

        return jsonify({"message": "Review added successfully", "review_id": review_id}), 201

    except Exception as e:
        print(f"Error adding review: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@review_bp.route("/", methods=["GET"])
def get_reviews():
    """
    Fetch reviews with optional filtering and sorting.
    """
    try:
        db = current_app.config["db"]
        review_collection = get_review_collection(db)

        # Optional filters and sorting
        rating = request.args.get("rating", type=int)
        sort_by_date = request.args.get("sort", default="asc")

        filters = {}
        if rating is not None:
            filters["rating"] = rating

        reviews = fetch_reviews(review_collection, filters=filters, sort_by_date=sort_by_date)
        return jsonify(reviews), 200

    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@review_bp.route("/<int:review_id>", methods=["GET"])
def get_review_by_id(review_id):
    """
    Fetch a single review by its custom review_id.
    """
    try:
        db = current_app.config["db"]
        review_collection = get_review_collection(db)

        # Find the review by its review_id
        review = review_collection.find_one({"review_id": review_id})
        if not review:
            return jsonify({"error": "Review not found"}), 404

        # Return the review as JSON
        return jsonify({
            "review_id": review["review_id"],
            "title": review["title"],
            "author": review["author"],
            "content": review["content"],
            "rating": review["rating"],
            "date": review["date"],
        }), 200

    except Exception as e:
        print(f"Error fetching review by ID: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@review_bp.route("/<int:review_id>", methods=["PUT"])
def update_existing_review(review_id):
    """
    Update an existing review by its custom review_id.
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not all(key in data for key in ("title", "author", "content", "rating")):
            return jsonify({"error": "All fields (title, author, content, rating) are required"}), 400

        # Prepare updated review data
        updated_data = {
            "title": data["title"],
            "author": data["author"],
            "content": data["content"],
            "rating": data["rating"],
            "date": datetime.utcnow()
        }

        db = current_app.config["db"]
        review_collection = get_review_collection(db)

        # Update the review
        updated = update_review(review_collection, review_id, updated_data)
        if not updated:
            return jsonify({"error": "Review not found"}), 404

        return jsonify({"message": "Review updated successfully"}), 200

    except Exception as e:
        print(f"Error updating review: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


@review_bp.route("/<int:review_id>", methods=["DELETE"])
def delete_existing_review(review_id):
    """
    Delete an existing review by its custom review_id.
    """
    try:
        db = current_app.config["db"]
        review_collection = get_review_collection(db)

        # Delete the review
        deleted = delete_review(review_collection, review_id)
        if not deleted:
            return jsonify({"error": "Review not found"}), 404

        return jsonify({"message": "Review deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting review: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500
