# Movie data API

This is the server-side component of a “movies” web application. This simple CRUD (Create, Read, Update, Delete) API application will provide users with access to information about different movies, directors and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies. It is built using Node.js, Express, and MongoDB.

## Features

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

## Getting Started

### Installation

1. Clone the Repository:

   ```bash
   git clone https://github.com/t22n84r/movie_api.git
   ```

2. Install Dependencies:

   ```bash
   cd movie_api
   npm install
   ```

3. Set Up Environment Variables:
   - Create a `.env` file in the project root.
   - Add your MongoDB Atlas connection string as `MONGODB_URI` in the `.env` file.

   Example `.env` Content:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.nrxb6zw.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```

### Usage

1. Start the Server:

   ```bash
   npm start
   ```

2. Access the API:
   - The API will be available at `http://localhost:8080`.
   - Use API endpoints to manage movie data.

### API Documentation

Explore the API documentation using Swagger UI:
- After starting the server, visit: `http://localhost:8080/api-docs`