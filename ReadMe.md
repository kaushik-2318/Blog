# Social Media App
This is a simple social media app built using Node.js, Express, and MongoDB. The app allows users to register, log in, create posts, like posts, and edit their own posts.

## Features
- User registration and login
- Creating posts
- Liking posts
- Editing posts
- Viewing user profiles
## Tech Stack
- Node.js
- Express
- MongoDB
- EJS
- bcrypt
- jsonwebtoken
- cookie-parser
## Project Structure
- `models`: Contains the Mongoose models for User and Post.
- `public`: Contains the static files for the app.
- `views`: Contains the EJS templates for the app.
- `app`.js: The main entry point for the app.
## Usage
To run the app, follow these steps:

1. Install the dependencies:
```
npm install
```
2. Start the app:
```
npm start
```
3. Open your browser and navigate to http://localhost:3000.
## API Endpoints
### POST /register
Register a new user.

Request body:

```json

{
  "email": "user's email",
  "password": "user's password",
  "name": "user's name",
  "age": "user's age",
  "username": "user's username"
}
```

Response:

- 200 OK: User registered successfully.
- 500 Internal Server Error: User already registered.
### POST /login
Log in a user.

Request body:

```json
{
  "email": "user's email",
  "password": "user's password"
}
```
Response:

- 200 OK: User logged in successfully.
- 500 Internal Server Error: Something went wrong.
### GET /logout
Log out a user.

Response:

- 302 Found: User logged out successfully.
### POST /createpost
Create a new post.

Request body:

```json
{
  "content": "post content"

}
```
Response:

- 200 OK: Post created successfully.
- 500 Internal Server Error: Something went wrong.
### GET /like/:id
Like or unlike a post.

Response:

- 200 OK: Post liked or unliked successfully.
### GET /edit/:id
Edit a post.

Response:

- 200 OK: Post edited successfully.
### POST /update/:id
Update a post.

Request body:

```json
{
  "content": "new post content"
}
```
Response:

- 302 Found: Post updated successfully.
