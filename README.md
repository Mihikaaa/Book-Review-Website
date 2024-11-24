# Book Review Web Application

# Project Overview
This is a web application designed to allow users to manage book reviews efficiently. The application provides functionality for creating, reading, updating, and deleting (CRUD) book reviews. Additionally, it includes powerful search and filtering options, enabling users to find reviews by unique IDs or refine them based on ratings and dates. The system also features user authentication to ensure a secure and personalized experience.

The backend is built using Flask with a database MongoDB, while the frontend uses React with TypeScript for a modern and seamless user experience.

# Technologies Used

Backend:
- Flask: Python-based web framework for handling API requests.
- Flask-CORS: To handle cross-origin requests.
- MongoDB: Database for storing user and book review data.

Frontend:
- React: For building a responsive user interface.
- TypeScript: Ensuring type safety in React components.
- Axios: For API communication between frontend and backend.

Development Environment:
Visual Studio Code (VS Code): Used for development, debugging, and project management.

# Setup Instructions

System Requirements:

- Python: Version 3.8 or above
- Node.js: Version 14 or above
- npm: For managing frontend dependencies
- Git: For version control
- Browser: For testing the application

# Backend Setup

1. Clone the Repository
`git clone https://github.com/Mihikaaa/Book-Review-Website.git`
`cd backend`

2. Set Up a Virtual Environment
`python -m venv venv`
`source venv/bin/activate`   # On macOS/Linux
`venv\Scripts\activate `     # On Windows

3. Install Dependencies
`pip install -r requirements.txt`

4. Database Initialization Create and set up the database:
`flask db init`
`flask db migrate`
`flask db upgrade`

5. Run the Backend
`flask run`

The API will be accessible at: http://localhost:5000

# Frontend Setup

1. Navigate to the Frontend Directory
`cd frontend`

2. Install Dependencies Install the required npm packages:
`npm install`

3. Start the Frontend Start the React development server:
`npm start`

The application will be available at: http://localhost:3000

# Features

1. User Authentication
- Secure login and registration functionality.

2. Dashboard
- A personalized welcome message with the user's username.
- Quick action buttons for managing book reviews.

3. Book Review Management
- Add new book reviews with a title, author, content, and rating.
- Update existing reviews to modify details or ratings.
- Delete reviews as needed.

4. Search and Filtering
- Search by ID: Quickly locate a specific book review using its unique ID.
- Filter Options:
    By Rating: Filter reviews by star ratings (1 to 5 stars).
    By Date: View reviews sorted by the latest or earliest date.
