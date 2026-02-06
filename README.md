
# Secure Workflow Platform (v2.0)

![Status](https://img.shields.io/badge/Status-Production-emerald?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-RLS_Isolated-blue?style=for-the-badge&logo=postgresql)
![Stack](https://img.shields.io/badge/Stack-React_Node_Supabase-white?style=for-the-badge&logo=react)

**A high-fidelity, data-sovereign task orchestration platform built for distributed agent networks.**
Designed with a "Solarpunk" aesthetic (`glassmorphism`, `emerald-500`) and engineered with enterprise-grade security logic.

## 🏗️ Architecture

### 🛡️ Double-Blind Data Isolation
Unlike standard CRUD apps, this platform enforces strict **Row Level Security (RLS)** logic at the application layer.
-   **Backend**: Middleware validates Supabase JWTs signature.
-   **Controller**: Every SQL query is injected with `user_id` filters derived from the verified token.
-   **Result**: Zero cross-talk. User A is mathematically incapable of accessing User B's data.

### ⚡ Serverless Hybrid Stack
-   **Frontend**: React (Vite) static site, deployed to Edge.
-   **Backend**: Express.js adapted for **Serverless Functions** (Vercel/AWS Lambda compatible).
-   **Database**: Supabase (PostgreSQL) with real-time capabilities.

## 🚀 Key Features

### 🔐 Authentication V2
-   **Provider**: Supabase Auth (Email/Password).
-   **Protection**: Rate-limit immune registration flow.
-   **Session**: Secure HTTP-only persistence with instant cache-clearing on logout.

### 🎨 UI/UX: "NetPulse" Engine
-   **Glassmorphism**: Translucent, blur-filter interface layers.
-   **Micro-Interactions**: Magnetic hover effects and time-dilation animations on data load.
-   **Responsive**: Mobile-first grid layout using TailwindCSS utility classes.

## 🛠️ Quick Start

### Prerequisites
-   Node.js v18+
-   Supabase Project URL & Anon Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/secure-workflow-platform.git
    ```

2.  **Environment Setup**
    Create `.env` in root:
    ```env
    SUPABASE_URL=your_url
    SUPABASE_ANON_KEY=your_key
    ```

3.  **Run Development Servers**
    ```bash
    # Terminal 1: Backend (Port 5000)
    cd src/backend && npm install && npm run dev

    # Terminal 2: Frontend (Port 5173)
    cd src/frontend && npm install && npm run dev
    ```

## 📂 Project Structure

```bash
/api             # Vercel Serverless Entry Points
/src
  /backend       # Express Server & Security Middleware
  /frontend      # React Application (Vite)
    /src/context # Global State (Auth, Tasks)
```

---
*Built for the Global Trends Internship Assignment by [Yeshwant].*
