# rox--assigment
 # Store Rating Platform

A full-stack web application that allows users to register, search for stores, and submit ratings. The platform features robust role-based access control (RBAC) with distinct dashboards for System Administrators, Store Owners, and Normal Users.

---

## 🔐 System Administrator Access

To test the application with full administrative privileges, use the following credentials:

* **Email:** `giriganesh016@gmail.com`
* **Password:** `Gani@3010`

---

## 📸 Application Screenshots

### Landing Page
<img width="1920" height="1080" alt="Screenshot (271)" src="https://github.com/user-attachments/assets/c10c050e-0b0e-4256-88a5-e1a3f436433e" />


### User & Store Owner Registration
<img width="1920" height="1080" alt="Screenshot (274)" src="https://github.com/user-attachments/assets/f4fd0393-7df9-46a4-85c0-e857dc36ec35" />


### Platform Login
<img width="1920" height="1080" alt="Screenshot (272)" src="https://github.com/user-attachments/assets/6c5e17ef-7446-416e-a33d-170dbc68a0b1" />


### System Administrator Dashboard
<img width="1920" height="1080" alt="Screenshot (276)" src="https://github.com/user-attachments/assets/380b5ecf-3dd2-4e74-90f1-33b0a3a941f4" />
<img width="1920" height="1080" alt="Screenshot (275)" src="https://github.com/user-attachments/assets/f4931d31-5f4a-4c36-9332-ed8454fbf022" />


---

## 🚀 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Express Validator
* **Database:** MySQL

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MySQL Server](https://dev.mysql.com/downloads/installer/)

---

## ⚙️ Backend Setup

**1. Navigate to the backend directory:**
\`\`\`bash
cd backend
\`\`\`

**2. Install dependencies:**
\`\`\`bash
npm install
\`\`\`

**3. Configure Environment Variables:**
Create a `.env` file in the root of the `backend` directory and add your MySQL details:
\`\`\`env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=Rox-DB
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
\`\`\`

**4. Database Setup:**
Open your MySQL client and execute the SQL script located in `backend/data/schema.sql` to create the database and tables.

**5. Start the Server:**
\`\`\`bash
npm run dev
\`\`\`

---

## 🖥️ Frontend Setup

**1. Navigate to the frontend directory:**
\`\`\`bash
cd frontend
\`\`\`

**2. Install dependencies:**
\`\`\`bash
npm install
\`\`\`

**3. Configure Environment Variables:**
Create a `.env` file in the root of the `frontend` directory:
\`\`\`env
VITE_API_BASE_URL=http://localhost:5000/api
\`\`\`

**4. Start the Application:**
\`\`\`bash
npm run dev
\`\`\`

---

## 🔑 User Roles & Features

* **System Administrator:** Can manage all users and stores, view overall platform statistics, and add new users or stores directly from the dashboard.
* **Store Owner:** Can view their store's average rating, see a detailed list of users who rated their store, and securely update their password.
* **Normal User:** Can browse the directory of stores, search by name or address, submit or modify ratings from 1 to 5 stars, and update their password.
 
