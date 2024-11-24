import React, { useState, useEffect } from "react";
import "../styles/MyBooks.css";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Review {
  review_id: number;
  title: string;
  author: string;
  content: string;
  rating: number;
  date: string;
}

const MyBooks: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDateOrder, setSelectedDateOrder] = useState<"latest" | "earliest" | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reviews");
        setReviews(response.data);
        setFilteredReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === "") {
      setFilteredReviews(reviews);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${term}`);
      setFilteredReviews([response.data]);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setFilteredReviews([]);
      } else {
        console.error("Error fetching review by ID:", error);
      }
    }
  };

  const applyFilter = () => {
    let filtered = [...reviews];

    if (selectedRating !== null) {
      filtered = filtered.filter((review) => review.rating === selectedRating);
    }

    if (selectedDateOrder === "latest") {
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (selectedDateOrder === "earliest") {
      filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    setFilteredReviews(filtered);
    setIsFilterOpen(false);
  };

  const resetFilter = () => {
    setSelectedRating(null);
    setSelectedDateOrder(null);
    setFilteredReviews(reviews);
    setIsFilterOpen(false);
  };

  const openDeleteConfirm = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (selectedReviewId === null) return;

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${selectedReviewId}`);
      setReviews((prev) => prev.filter((review) => review.review_id !== selectedReviewId));
      setFilteredReviews((prev) =>
        prev.filter((review) => review.review_id !== selectedReviewId)
      );
      setIsDeleteConfirmOpen(false);
      setIsDeleteSuccessOpen(true);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const openUpdateModal = (review: Review) => {
    setSelectedReview(review);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedReview(null);
    setIsUpdateModalOpen(false);
  };

  const handleUpdate = async () => {
    if (!selectedReview) return;

    try {
      await axios.put(`http://localhost:5000/api/reviews/${selectedReview.review_id}`, {
        title: selectedReview.title,
        author: selectedReview.author,
        content: selectedReview.content,
        rating: selectedReview.rating,
      });

      setReviews((prev) =>
        prev.map((review) =>
          review.review_id === selectedReview.review_id ? selectedReview : review
        )
      );
      setFilteredReviews((prev) =>
        prev.map((review) =>
          review.review_id === selectedReview.review_id ? selectedReview : review
        )
      );

      setIsUpdateModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="my-books-page">
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo-image.png" alt="Logo" className="logo" />
        </div>
        <div className="nav-links">
          <a href="/home" className="nav-link">Home</a>
          <a href="/my-books" className="nav-link active">My Books</a>
          <a href="/add-review" className="nav-link">Add Review</a>
        </div>
        <button className="logout-button" onClick={() => navigate("/login")}>
          Exit
        </button>
      </nav>

      <div className={`content ${isFilterOpen || isDeleteConfirmOpen || isDeleteSuccessOpen || isUpdateModalOpen || isSuccessModalOpen ? "blurred" : ""}`}>
        <div className="filter-search">
          <h1 className="my-books-title">My Books</h1>
          <div className="filter-search-container">
            <button className="filter-button" onClick={() => setIsFilterOpen(true)}>Filter</button>
            <input
              type="text"
              placeholder="Search by Review ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="reviews-container">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div className="review-card" key={review.review_id}>
              <h3>{review.title}</h3>
              <p><strong>by {review.author}</strong></p>
              <p>Review ID: {review.review_id}</p>
              <p>{review.content}</p>
              <div className="rating-date">
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      size={18}
                      color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                    />
                  ))}
                  <span>{review.rating}</span>
                </div>
                <p className="date">{new Date(review.date).toLocaleDateString()}</p>
              </div>
              <div className="actions">
                <button className="update-button" onClick={() => openUpdateModal(review)}>
                  Update
                </button>
                <button className="delete-button" onClick={() => openDeleteConfirm(review.review_id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
            <div className="no-results-message">
              <h3>No results found</h3>
            </div>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="filter-modal">
          <div className="modal-contentt">
          <div className="filter-header">
            <h2 className="filter-title">Filter Reviews</h2>
            <button
                className="filter-close-button"
                onClick={() => setIsFilterOpen(false)}
            >
                ×
            </button>
            </div>
            <div>
              <b><label>Filter by Rating:</label></b>
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star}>
                  <input
                    type="radio"
                    id={`rating-${star}`}
                    name="rating"
                    checked={selectedRating === star}
                    onChange={() => setSelectedRating(star)}
                  />
                  <label htmlFor={`rating-${star}`}>{star} Star</label>
                </div>
              ))}
            </div>
            <div>
              <b><label>Sort by Date:</label></b>
              <div>
                <input
                  type="radio"
                  id="latest"
                  name="date"
                  checked={selectedDateOrder === "latest"}
                  onChange={() => setSelectedDateOrder("latest")}
                />
                <label htmlFor="latest">Date Added: Latest</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="earliest"
                  name="date"
                  checked={selectedDateOrder === "earliest"}
                  onChange={() => setSelectedDateOrder("earliest")}
                />
                <label htmlFor="earliest">Date Added: Earliest</label>
              </div>
            </div>
            <div className="filter-actions">
              <button className="filter-button" onClick={applyFilter}>Apply</button>
              <button className="reset-button" onClick={resetFilter}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Are you sure you want to delete this Review?</h3>
            <div className="delete-confirm-actions">
              <button className="confirm-yes" onClick={handleDelete}>
                Yes
              </button>
              <button className="confirm-no" onClick={() => setIsDeleteConfirmOpen(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteSuccessOpen && (
        <div className="delete-success-modal">
          <div className="delete-success-content">
            <button className="close-button" onClick={() => setIsDeleteSuccessOpen(false)}>
              ×
            </button>
            <div className="success-icon">✔</div>
            <h3>Success</h3>
            <p>Book Review Deleted Successfully!</p>
          </div>
        </div>
      )}

      {isUpdateModalOpen && selectedReview && (
        <div className="update-modal">
          <div className="modal-content">
            <h2>Update Book Review</h2>
            <form>
              <label>Review ID:</label>
              <input type="text" value={selectedReview.review_id} readOnly />

              <label>Book Title:</label>
              <input
                type="text"
                value={selectedReview.title}
                onChange={(e) =>
                  setSelectedReview({ ...selectedReview, title: e.target.value })
                }
              />

              <label>Author:</label>
              <input
                type="text"
                value={selectedReview.author}
                onChange={(e) =>
                  setSelectedReview({ ...selectedReview, author: e.target.value })
                }
              />

              <label>Review:</label>
              <textarea
                value={selectedReview.content}
                onChange={(e) =>
                  setSelectedReview({ ...selectedReview, content: e.target.value })
                }
              />

              <label>Rate:</label>
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={24}
                    color={index < selectedReview.rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() =>
                      setSelectedReview({ ...selectedReview, rating: index + 1 })
                    }
                  />
                ))}
              </div>

              <div className="actions">
                <button type="button" className="cancel-button" onClick={closeUpdateModal}>
                  Cancel
                </button>
                <button type="button" className="update-button" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="success-modal">
          <div className="modal-content">
            <button className="closee-button" onClick={() => setIsSuccessModalOpen(false)}>
              ×
            </button>
            <div className="success-icon">✔</div>
            <h3>Success</h3>
            <p>Book Review Updated Successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
