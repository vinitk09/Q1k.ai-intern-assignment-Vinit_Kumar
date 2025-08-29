#  Task Management Application

This is a complete task management application built with a Next.js frontend and a Python FastAPI backend, using MongoDB as the database. It allows users to create, read, update, and delete tasks through a clean, modern, and responsive user interface.


## 🚀 Features

- **Full CRUD Functionality**: Create, view, edit, and delete tasks.
- **Interactive Dashboard**: Get a quick overview of task statistics, including total tasks and tasks by status.
- **Filtering and Searching**: Easily find tasks by filtering by status/priority or searching by title/description.
- **Responsive Design**: A mobile-friendly interface built with shadcn/ui and Tailwind CSS.
- **API Documentation**: Automatic interactive API documentation via Swagger UI.

## 🛠️ Tech Stack

- **Frontend**: Next.js (React), shadcn/ui, Tailwind CSS
- **Backend**: FastAPI (Python), Pydantic
- **Database**: MongoDB Atlas (Cloud)

## ⚙️ Setup and Installation

To get this project running locally, you'll need to set up the backend and frontend separately.

### 1. Clone the Repository

```bash
git clone https://github.com/vinitk09/Q1k.ai-intern-assignment-Vinit_Kumar.git
cd Q1k.ai-intern-assignment-Vinit_Kumar
```

### 2. Backend Setup (FastAPI)

**Prerequisites**: Python 3.8+, pip, and a MongoDB Atlas account.

1. Navigate to the backend directory:
   ```bash
   cd fastapi_project
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows, use `venv\Scripts\activate`
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the `fastapi_project` directory and add your MongoDB Atlas connection string:
   ```
   MONGO_DETAILS="mongodb+srv://<username>:<password>@cluster...mongodb.net/"
   ```

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

The backend API will be running at http://localhost:8000. You can view the interactive documentation at http://localhost:8000/docs.

### 3. Frontend Setup (Next.js)

**Prerequisites**: Node.js 18+, npm/yarn.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the frontend directory. Add the URL of your running backend API:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend application will be running at http://localhost:3000.

## 📖 API Endpoint Overview

The backend provides the following RESTful API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics. |
| POST | `/api/tasks` | Create a new task. |
| GET | `/api/tasks` | Get all tasks with filtering & pagination. |
| GET | `/api/tasks/{id}` | Get a single task by its ID. |
| PUT | `/api/tasks/{id}` | Update an existing task. |
| DELETE | `/api/tasks/{id}` | Delete a task. |

## 🗃️ Database

This application uses **MongoDB Atlas** for cloud database hosting. Make sure to set up your MongoDB Atlas cluster and update the connection string in the backend `.env` file.

## 📱 Application Screenshots

<img width="1897" height="866" alt="image" src="https://github.com/user-attachments/assets/8a225c65-5a3f-46ab-b72a-11a2cdaeef1a" />

*Dashboard view showing task statistics and recent tasks*

<img width="427" height="761" alt="image" src="https://github.com/user-attachments/assets/f15b1683-6937-4213-b031-bc8dba82fde6" />

*Tasks list with filtering and search functionality*

<img width="1891" height="862" alt="image" src="https://github.com/user-attachments/assets/b8a13af7-48c2-4b16-946f-263a13fc83ea" />

*Form for adding new tasks*
<img width="1732" height="862" alt="image" src="https://github.com/user-attachments/assets/4e66f107-467c-4a58-ad07-43147e6d56cc" />

*Edit existing task details*

