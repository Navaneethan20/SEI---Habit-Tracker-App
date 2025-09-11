# 🌱 SEI Habit Tracker App

A full-stack **Habit Tracking Application** built with **React (Vite + TailwindCSS)** for the frontend and **FastAPI** for the backend.  
Track your daily habits, earn badges automatically, and visualize your progress with a clean and interactive UI.  

---

## ✨ Features

✅ User Authentication (Signup/Login)  
✅ Dashboard with habit overview & stats  
✅ Add, edit, and delete habits  
✅ Interactive calendar view for tracking  
✅ 🎖️ Auto-awarded badges for milestones  
✅ Profile management  
✅ Modern UI with TailwindCSS, animations & effects  

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ React (Vite)
- 🎨 TailwindCSS
- 🔄 Axios (API calls)
- ✨ Framer Motion (animations)

### **Backend**
- 🚀 FastAPI
- 🗄️ SQLite (can be switched to PostgreSQL/MySQL)
- 🔐 JWT Authentication

---

## 📂 Project Structure

sei-habit-app/
│── backend/
│ ├── main.py
│ ├── models.py
│ ├── schemas.py
│ ├── database.py
│ └── routers/
│ ├── auth.py
│ ├── habits.py
│ └── badges.py
│
│── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Habits.jsx
│ │ │ └── Profile.jsx
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── HabitForm.jsx
│ │ │ ├── CalendarView.jsx
│ │ │ └── BadgeCard.jsx
│ │ └── utils/
│ │ └── api.js
│ ├── index.css
│ └── tailwind.config.js
│
│── README.md
│── .gitignore

yaml
Copy code

---

## ⚡ Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/yourusername/sei-habit-app.git
cd sei-habit-app
2️⃣ Backend Setup (FastAPI)
bash
Copy code
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
Backend runs at 👉 http://127.0.0.1:8000

3️⃣ Frontend Setup (React + Vite + Tailwind)
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs at 👉 http://localhost:5173

🎖️ Badges Auto-Award System
🏆 7 Days Streak → "Consistency Champ"

📅 30 Days Streak → "One Month Hero"

💯 100 Days Streak → "Century Performer"

Badges are awarded automatically when streak milestones are achieved.

📸 Screenshots
Login Page	Dashboard	Calendar View

🤝 Contributing
🍴 Fork this repo

🔧 Create a new branch (feature-xyz)

✅ Commit your changes

📤 Push to the branch

🎉 Open a Pull Request

📜 License
MIT License © 2025 Your Name

💡 Acknowledgements
React

FastAPI

TailwindCSS

Framer Motion
