# Task Management API - Backend

This directory contains the Python FastAPI backend for the Full-Stack Task Management Application. It provides a robust RESTful API for all task-related operations, connecting to a MongoDB database.

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Data Validation**: Pydantic
- **Database**: MongoDB
- **Server**: Uvicorn

## ⚙️ Local Setup and Installation

**Prerequisites**: Python 3.8+, pip, and a MongoDB Atlas account.

1. **Navigate to the backend directory**:
   ```bash
   cd fastapi_project
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Database Connection**:
   Open the main.py file and locate the MONGO_DETAILS variable. Replace the default connection string with your own MongoDB Atlas connection string.

5. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

The backend API will now be running at http://localhost:8000.

## 📖 API Documentation

FastAPI automatically generates interactive API documentation. Once the server is running, you can access it at:

- **Swagger UI**: http://localhost:8000/docs

## 📖 API Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics. |
| POST | `/api/tasks` | Create a new task. |
| GET | `/api/tasks` | Get all tasks with filtering & pagination. |
| GET | `/api/tasks/{id}` | Get a single task by its ID. |
| PUT | `/api/tasks/{id}` | Update an existing task. |
| DELETE | `/api/tasks/{id}` | Delete a task. |
