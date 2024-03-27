# Simple Profile Commenting System

## Table of Contents
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
    - [Profiles](#profiles)
    - [Comments](#comments)

## Setup

### Prerequisites
- Node.js (v16.20.2 or higher)
- npm (v8.19.4 or higher)

### Installation
1. Clone the repository:
   ```
   git clone git@github.com:wawew/simple-commenting-system.git
   ```
2. Navigate to the project directory:
   ```
   cd simple-commenting-system
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables. You can use the `.env.example` file as a template.

## Running the Application

### Development
To run the application in development mode, use the following command:
```
npm run dev
```
The application will start, and you can access it at `http://localhost:3000`.

### Unit Tests
This project uses Jest for unit testing. To run the unit tests, run:
```
npm run test
```

## API Endpoints

### Base URL
`http://localhost:3000`

### Authentication
Some endpoints in this API require simple authentication which checks for a valid authentication in the request headers.

#### Required Headers
For endpoints that require authentication, you must include the following header in your request:

- `X-Profile-ID`: The value should be a profile ID.

#### Endpoints Requiring Authentication
- **POST /profile/comment/create**: Create a new comment. Requires authentication.
- **GET /profile/:profileId/comments**: Retrieve comments for a profile. Requires authentication.
- **POST /profile/comment/:id/vote**: Vote on a comment. Requires authentication.

### Endpoints

#### Profiles
- **GET /:id**: Retrieve a specific profile by ID.
  - Path Parameters:
    - `id`: The ID of the profile to retrieve.
  - Response:
    ```json
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "mbti": "string",
        "enneagram": "string",
        "variant": "string",
        "tritype": "number",
        "socionics": "string",
        "sloan": "string",
        "psyche": "string",
        "image": "string"
    }
    ```
- **POST /profile/create**: Create a new profile.
  - Request Body:
    ```json
    {
        "name": "string",
        "description": "string",
        "mbti": "string",
        "enneagram": "string",
        "variant": "string",
        "tritype": "number",
        "socionics": "string",
        "sloan": "string",
        "psyche": "string",
        "image": "string"
    }
    ```
  - Response:
    ```json
    {
        "id": "string"
    }
    ```

#### Comments
- **POST /profile/comment/create**: Create a new comment.
  - Request Body:
    ```json
    {
        "profileId": "string",
        "title": "string",
        "description": "string",
        "personalities": [
            {
                "personality": "string",
                "detail": "string"
            }
        ]
    }
    ```
  - Response:
    ```json
    {
        "message": "Success"
    }
    ```
- **GET /profile/:profileId/comments**: Retrieve comments for a profile.
  - Path Parameters:
    - `profileId`: The ID of the profile to comment on.
  - Query Parameters:
    - `filter[personality]`: Filter comments based on a specific personality type (e.g., `MBTI`, `Enneagram`, `Zodiac`). This parameter is optional.
    - `pagination[page]`: The page number for pagination.
    - `pagination[take]`: The number of comments per page.
    - `sort`: The sorting order of the comments (`newest` or `bestVotes`).
  - Response:
    ```json
    {
        "page": "number",
        "take": "number",
        "totalPages": "number",
        "totalData": "number",
        "data": [
            {
                "id": "string",
                "title": "string",
                "description": "string",
                "personalities": [
                    {
                    "personality": "string",
                    "detail": "string"
                    }
                ],
                "votes": {
                    "upvotes": "number",
                    "hasVoted": "boolean"
                },
                "createdBy": {
                    "id": "string",
                    "name": "string",
                    "image": "string"
                },
                "createdAt": "date"
            }
        ]
    }
     ```
- **POST /profile/comments/:id/vote**: Vote on a comment.
  - Path Parameters:
    - `id`: The ID of the comment to vote on.
  - Response:
    ```json
    {
        "message": "Success"
    }
    ```
