# PolyScan AI - AI-Powered Plastic Identification & Sustainability Assistant

PolyScan AI is a full-stack SaaS web application designed to estimate polymer types from photographs of plastic items using Computer Vision (Google Gemini Vision API) and provide actionable sustainability recommendations, recyclability metrics, upcycling ideas, and eco-impact analytics.

---

## 🌟 Key Features

- **AI Vision Polymer Estimation**: Upload or capture photographs of plastic items (water bottles, food tubs, packaging film, caps) to visually estimate plastic resin type (`PET`, `HDPE`, `PVC`, `LDPE`, `PP`, `PS`, `ABS`).
- **Structured Knowledge Base**: Standard polymer database with detailed recyclability metrics, manufacturing processes, disposal guidelines, and upcycling ideas.
- **Visual Confidence & Scientific Disclaimer**: Displays confidence level (0-100%) and scientific position disclaimer explaining that results are AI-based visual estimates.
- **Browser Camera Support**: Capture live photographs directly using `navigator.mediaDevices.getUserMedia()`.
- **Database History**: Complete MongoDB scan history with polymer filter, search, date sorting, and record deletion.
- **Interactive Recharts Dashboard**: Real-time aggregation of total scans, polymer distribution, daily scan activity timeline, and recyclability rates.
- **Eco-Tech Design System**: Premium light sustainability theme matching exact visual reference guidelines (`#F5F7F3` background, `#16803A` primary green, `#EAF6E9` active pills, 250px global sidebar).
- **Decoupled Architecture**: Frontend communicates **ONLY** with Express Backend; backend securely interfaces with Gemini API, Cloudinary, and MongoDB.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Storage**: Cloudinary (with local disk storage fallback)
- **AI Model**: Google Gemini API (`@google/genai` or `@google/generative-ai` with dynamic `GEMINI_MODEL`)
- **Authentication**: JWT & bcryptjs
- **File Processing**: Multer (10MB limit, JPG/PNG/WEBP)

---

## 📁 Directory Structure

```
polyscan-ai/
├── backend/
│   ├── config/
│   │   ├── db.js             # MongoDB connection logic
│   │   └── cloudinary.js     # Cloudinary / local fallback storage
│   ├── controllers/          # Auth, Scan, Dashboard, Polymer & Profile controllers
│   ├── data/
│   │   ├── polymers.json     # Knowledge base dataset (PET, HDPE, PVC, LDPE, PP, PS, ABS)
│   │   └── seed.js           # Database seeder script
│   ├── middleware/           # Auth, Upload (Multer) & ErrorHandler
│   ├── models/               # User & Scan Mongoose Schemas
│   ├── routes/               # Express API router definitions
│   ├── services/
│   │   ├── geminiService.js  # Gemini Vision AI service
│   │   ├── polymerService.js # Knowledge base lookup engine
│   │   └── prompts.js        # Gemini Vision prompt engineering
│   ├── server.js             # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/           # Generated hero graphic & eco illustrations
│   │   ├── components/       # Sidebar, TopNav, CameraModal, Toast, EmptyState, Disclaimer
│   │   ├── context/          # AuthContext & ToastContext
│   │   ├── layouts/          # MainLayout
│   │   ├── pages/            # Home, Scan, Result, Details, History, Dashboard, Learn, Profile, Settings, Login, Register
│   │   ├── services/         # API Axios service wrapper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polyscan-ai
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=polyscan_ai_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

> **Note**: If `CLOUDINARY_*` or `GEMINI_API_KEY` are omitted, PolyScan AI automatically activates built-in local file storage and intelligent visual heuristic fallback modes so the application runs seamlessly out-of-the-box!

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Seed Database (Optional)
```bash
npm run seed
```

### 3. Run Development Servers
```bash
# Starts Express backend (port 5000) and React frontend (port 5173) concurrently
npm run dev
```

Open your browser at `http://localhost:5173`. You can log in with:
- **Email**: `demo@polyscan.ai`
- **Password**: `password123`

---

## 📡 Backend REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/auth/me` - Fetch authenticated user details
- `POST /api/auth/logout` - Invalidate session

### Plastic Scans
- `POST /api/scans/analyze` - Upload image (Multer) & run Gemini Vision AI analysis
- `GET /api/scans` - Fetch user scan history (supports `polymer`, `search`, `sort`)
- `GET /api/scans/:id` - Fetch single scan details
- `DELETE /api/scans/:id` - Delete scan & remove image storage

### Dashboard & Analytics
- `GET /api/dashboard/stats` - Fetch aggregated scan analytics & chart metrics

### Polymer Knowledge Base
- `GET /api/polymers` - List all supported polymer materials
- `GET /api/polymers/:code` - Fetch polymer details (e.g. PET)

---

## 📜 License
MIT License - Designed & Created for PolyScan AI Sustainability Platform.
# polyscan-ai
