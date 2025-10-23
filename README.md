# 🧮 Math Practice App

A simple and fun **web application to practice addition and subtraction**.
Designed for children to answer aloud while a parent or teacher marks answers as **correct** or **incorrect**.

Built with:

* **FastAPI** (Python) for the backend
* **React + Vite + TailwindCSS** for the frontend
* **Docker Compose** for easy deployment

---

## 🚀 Features

* ✅ Configurable number of operations (10, 20, 30, 40, or 50)
* ➕ **Addition**, ➖ **Subtraction**, or 🔀 **Mixed mode**
* 🎚️ Adjustable **difficulty levels** based on digits:

  * Level 1 → 1-digit numbers
  * Level 2 → 2-digit + 1-digit
  * Level 3 → 2-digit + 2-digit
  * Level 4 → 3-digit + 2-digit
  * Level 5 → 3-digit + 3-digit
  * Level 6 → 4-digit + 3-digit
* 🧠 Parent manually validates answers (no need for speech recognition)
* 📊 End-of-session performance summary

---

## 🏗️ Project Structure

```
math-practice-app/
│
├── backend/
│   ├── app.py
│   ├── utils.py
│   ├── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Running with Docker

### 1. Build and start all services

```bash
docker-compose up --build
```

This will:

* Build and run the **backend** (FastAPI) on port `2522`
* Build and run the **frontend** (Nginx serving React) on port `2521`

### 2. Open the app in your browser

```
http://localhost:2521
```

If you’re on a local network, you can also access it via:

```
http://<HOST-IP>:2521
```

---

## 🧩 Development (without Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 2521
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

The frontend proxy (`/api/*`) is configured to forward requests to the backend automatically.

---

## 🧠 API Endpoints

| Method | Endpoint                   | Description                                                                  |
| ------ | -------------------------- | ---------------------------------------------------------------------------- |
| `POST` | `/api/start`               | Start a new session with settings (`mode`, `difficulty`, `total_operations`) |
| `GET`  | `/api/next/{session_id}`   | Get the next math operation                                                  |
| `POST` | `/api/answer/{session_id}` | Record whether the answer was correct or incorrect                           |

---

## 🔐 Difficulty Logic

| Level | Example    |
| ----- | ---------- |
| 1     | 4 + 5      |
| 2     | 14 + 5     |
| 3     | 14 + 15    |
| 4     | 141 + 15   |
| 5     | 141 + 151  |
| 6     | 1414 + 151 |

This logic also applies to subtractions. For subtraction operations, the app ensures the result is never negative.

---

## 🧰 Technologies Used

* **Frontend:** React 18, Vite, TailwindCSS
* **Backend:** FastAPI, Python 3.11
* **Proxy & Hosting:** Nginx
* **Containerization:** Docker & Docker Compose

---

## 📦 Docker Overview

| Service      | Port (Internal) | Port (Host) | Description                 |
| ------------ | --------------- | ----------- | --------------------------- |
| **backend**  | 2521            | 2522        | FastAPI server              |
| **frontend** | 2521            | 2521        | Nginx serving React app     |
| **network**  | —               | —           | Internal bridge (`mathnet`) |

---

## 🧹 Commands

| Task                  | Command                         |
| --------------------- | ------------------------------- |
| Build containers      | `docker-compose build`          |
| Start containers      | `docker-compose up`             |
| Stop containers       | `docker-compose down`           |
| View logs             | `docker-compose logs -f`        |
| Rebuild frontend only | `docker-compose build frontend` |

---

## 👨‍👩‍👧 How It Works

1. The parent configures:

   * Mode (sum, subtraction, or mixed)
   * Difficulty level
   * Number of operations
2. The app generates random problems.
3. The child answers **aloud**.
4. The parent presses **✅ Correct** or **❌ Incorrect**.
5. After completing all exercises, a summary screen displays:

   * Total correct answers
   * Incorrect answers
   * Final score (percentage)

---

## 🧾 License

This project is released under the **MIT License**.
Feel free to use, modify, and share it for educational or personal use.

