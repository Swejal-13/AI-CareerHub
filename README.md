# AI CareerHub 🚀

**Smart Resume Analyzer & Job Matching Platform**

A full-stack SaaS platform helping job seekers analyze resumes, match with jobs, track applications, prep for interviews, and get AI career guidance — plus recruiter-side features.

---

## ✨ Features

### Job Seeker
| Feature | Description |
|---|---|
| 📄 Resume Analyzer | Upload PDF/DOCX → ATS score, keyword extraction, improvement suggestions |
| ✍️ Bullet Rewriter | AI-powered before/after resume bullet improvement |
| 🗂️ Version Manager | Upload multiple resumes, compare ATS scores |
| 💼 Job Portal | Browse jobs with role/stack/salary filters + AI match % |
| 🎯 Job Matching | Resume-to-job similarity scoring with skill gap analysis |
| 📋 Application Tracker | Drag-and-drop Kanban (Applied → Interview → Offer → Rejected) |
| 🤖 Career Assistant | Chat-based AI for career advice |
| 🎤 Mock Interview | Question sets + AI answer scoring (0–10) with feedback |
| 🗺️ Skill Roadmap | Dream job → skill gap → week-by-week learning plan |
| 📝 Cover Letter | AI-generated, tone-adjustable cover letters |

### Recruiter
| Feature | Description |
|---|---|
| 📌 Post Jobs | Create and manage job postings |
| 🏆 Candidate Ranking | AI-scored candidates (skill match, ATS, experience) |
| 💪 Strengths/Gaps | Detailed breakdown per candidate |

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Zustand |
| Backend | Node.js + Express |
| Database | MongoDB  |
| Auth | JWT + bcrypt |
| Drag & Drop | @hello-pangea/dnd |
| Charts | Recharts |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (optional)

---

### 1. Clone & Setup

```bash
git clone <repo-url>
cd ai-careerhub
```

---

### 2. Start the Backend

```bash
cd server

# Copy env file and configure
cp .env.example .env
# Edit .env — set MONGO_URI if you have MongoDB
# If you skip MONGO_URI, the server runs in mock mode (no DB needed)

npm install
npm run dev
# Server starts at http://localhost:5000
```

---

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
# App starts at http://localhost:5173
```

---

### 4. Login

Use the **demo account** shortcut on the login page, or:
- Email: `demo@careerhub.io`
- Password: `demo1234`

Or create a new account via the signup page.
---
