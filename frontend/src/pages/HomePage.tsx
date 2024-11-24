import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

interface HomePageProps {
  username: string; // Explicitly define the type of username
}

const HomePage: React.FC<HomePageProps> = ({ username }) => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo-image.png" alt="Logo" className="logo" />
        </div>
        <div className="nav-links">
          <a href="/home" className="nav-link active">Home</a>
          <a href="/my-books" className="nav-link">My Books</a>
          <a href="/add-review" className="nav-link">Add Review</a>
        </div>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("username"); // Clear username from localStorage
            window.location.href = "/login"; // Redirect to login
          }}
        >
          Exit
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-section">
          <h2>Hello {username}!</h2>
          <h1>Welcome to ReadRank</h1>
          <p className="tagline">Rank Your Reads, Discover The Best</p>
        </div>

        <section className="about-us">
          <h2>About Us</h2>
          <p>
            At ReadRank, we believe every book has a story to tell, and every reader has a
            voice to share. Our platform is designed to connect book enthusiasts from all
            walks of life, enabling them to rate, review, and discover their next favorite
            read. Whether you're a casual reader or a passionate bibliophile, ReadRank
            empowers you to explore diverse genres, find top-rated books, and contribute to
            a growing community of literary lovers.
          </p>
        </section>

        <section className="quick-actions">
          <h2>Quick Action</h2>
          <div className="actions-container">
            <div className="action-card" onClick={() => navigate("/my-books")}>
              <img src="/mybooks.png" alt="My Books" />
              <p>My Books</p>
            </div>
            <div className="action-card" onClick={() => navigate("/add-review")}>
              <img src="/add-review.png" alt="Add Review" />
              <p>Add Review</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
