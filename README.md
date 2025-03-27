# JARA E-commerce Platform

[Visit JARA E-commerce website on this link](https://ecommerce-fe-4gm.pages.dev)  
This is a full-stack e-commerce web application built with the MERN stack as a practice project.  
The project consists of two repositories:

- **Frontend** – [View Frontend Repository](https://github.com/jeannjang/jara-ecommerce-fe)
- **Backend** – This repository

## Quick Preview
![blur_c](https://github.com/user-attachments/assets/c27f0c97-a4b0-4e4a-b457-f1a445b1c3a5)

## Backend Overview

This provides `RESTful endpoints` for managing users, products, shopping carts, orders, and reviews. The API is built with `Node.js, Express, and MongoDB`.

## Features

### User Features

- **User Authentication**: Registration, authentication
- **Product Management**: CRUD operations with inventory tracking
- **Shopping Cart**: Add, remove, update products and quantity
- **Order Processing**: Order creation, stock validation
- **Reviews**: Allow users to create, read, and delete product reviews
- **Admin Features**: Manage orders and products for authorized administrators

## Tech Stack

- **Node.js, Express** (JS runtime env, REST API server)
- **MongoDB, Mongoose** (Database, MongoDB object modeling for Node.js)
- **JWT, Bcrypt** (Authentication & password encryption)
- **Google Auth Library** (For Google OAuth integration)
- **CORS** (To bypass the Same-Origin Policy)
- **Dotenv** (.env management)

## How to start

### Requirement

- Node.js (v > v14)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create .env file with:
   ```
   PORT=5010
   DB_URI=mongodb://localhost:27017/jara_ecommerce
   JWT_SECRET_KEY=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the dev server:
   ```
   npm run dev
   ```

- The API will be available at http://localhost:5010/api

## Data Flow

1. Client makes a request to an API endpoint
2. Request is authenticated if required
3. Controller handles the request logic
4. Data is retrieved or modified in MongoDB using Mongoose models
5. Response is sent back to the client

## Deployment

The backend API is automatically deployed using `Fly.io` with configuration defined in fly.toml. The Docker container is built using the provided `Dockerfile`.  
When changes are pushed to the main branch, the CI/CD pipeline builds a Docker image, pushes the image to the container registry and deploys the updated app to Fly.io.
