import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddReview.css";
import { FaStar } from "react-icons/fa";

const AddReview: React.FC = () => {
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    content: "",
    rating: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewId, setReviewId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Close modal on pressing the "Escape" key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleReset = () => {
    setFormData({
      bookTitle: "",
      author: "",
      content: "",
      rating: 0,
    });
    setError(null); // Clear error message
    setReviewId(null); // Clear review ID
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.bookTitle || !formData.author || !formData.content || formData.rating === 0) {
      setError("All fields are required and a rating must be selected.");
      return;
    }

    if (formData.bookTitle.trim().length < 3 || formData.content.trim().length < 10) {
      setError("Book title must be at least 3 characters and review at least 10 characters.");
      return;
    }

    try {
      // Make POST request to the backend
      const { bookTitle: title, author, content, rating } = formData; // Destructure with a mapping for bookTitle -> title
        const response = await axios.post(
        "http://localhost:5000/api/reviews/",
        {
        title,
        author,
        content,
        rating,
        },
        { withCredentials: true }
    );

      if (response.status === 201) {
        setReviewId(response.data.review_id); // Get the generated review_id
        setIsModalOpen(true); // Show success modal
        handleReset(); // Reset the form
      }
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to add the review. Please try again later.";
      setError(message);
    }
  };

  return (
    <div className="add-review-page">
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo-image.png" alt="Logo" className="logo" />
        </div>
        <div className="nav-links">
          <a href="/home" className="nav-link">Home</a>
          <a href="/my-books" className="nav-link">My Books</a>
          <a href="/add-review" className="nav-link active">Add Review</a>
        </div>
        <button className="logout-button" onClick={() => navigate("/login")}>Exit</button>
      </nav>

      <div className="review-form-container">
        <h2>Add Book Review</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                placeholder="Enter the book title"
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter the author's name"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your review here"
            ></textarea>
          </div>
          <div className="form-group form-row">
            <label>Rate</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  color={star <= formData.rating ? "#ffc107" : "#e4e5e9"}
                  onClick={() => handleRatingClick(star)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="reset-button" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="add-button">
              Add
            </button>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="modal-icon">
              <span>&#10004;</span>
            </div>
            <h3>Succeed</h3>
            <p>Book added successfully with Review ID: {reviewId}</p>
            <button className="closee-button" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReview;
