# Collab Notes — MERN Collaborative Note App

A collaborative note-taking web application built using the MERN stack with authentication, full-text search, rich text editing, and collaborator management.

## Features

- JWT Authentication (Register / Login)
- Rich Text Editor (React Quill)
- Full-text Search
- Note Creation and Deletion
- Collaborator Management
- Shared Notes
- Modern Tailwind CSS UI
- Responsive Dashboard

## Tech Stack

Frontend
- React
- Tailwind CSS
- React Quill

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure
collab-notes-mern
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── README.md
└── .env.example


## Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/collab-notes-mern.git
cd collab-notes-mern

Backend setup
cd backend
npm install
npm start
http://localhost:5000

Frontend Setup
cd frontend
npm install
npm run dev
http://localhost:5173

## Environment Variables

Create a `.env` file in the backend folder using `.env.example`.

Example:

PORT=5000  
MONGO_URI=mongodb://127.0.0.1:27017/collab-notes  
JWT_SECRET=your_secret_key
