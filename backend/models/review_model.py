from bson.objectid import ObjectId

def get_review_collection(db):
    """
    Returns the reviews collection from the MongoDB database.
    """
    return db["reviews"]

def get_next_review_id(db):
    """
    Get the next review_id by incrementing the counter in the counters collection.
    """
    counters_collection = db["counters"]
    result = counters_collection.find_one_and_update(
        {"_id": "review_id"},
        {"$inc": {"seq": 1}},
        return_document=True  # Returns the updated document
    )
    return result["seq"]

def create_review(review_collection, review_data):
    """
    Inserts a new review into the reviews collection.
    """
    return review_collection.insert_one(review_data)

def fetch_reviews(review_collection, filters=None, sort_by_date="asc"):
    """
    Fetches reviews with optional filtering and sorting.
    """
    query = filters if filters else {}
    sort_order = 1 if sort_by_date == "asc" else -1

    reviews = review_collection.find(query).sort("date", sort_order)
    return [
        {
            "review_id": review["review_id"],
            "title": review["title"],
            "author": review["author"],
            "content": review["content"],
            "rating": review["rating"],
            "date": review["date"],
        }
        for review in reviews
    ]

def update_review(review_collection, review_id, updated_data):
    """
    Updates a review by its custom review_id.
    """
    result = review_collection.update_one({"review_id": review_id}, {"$set": updated_data})
    return result.matched_count > 0

def delete_review(review_collection, review_id):
    """
    Deletes a review by its custom review_id.
    """
    result = review_collection.delete_one({"review_id": review_id})
    return result.deleted_count > 0
