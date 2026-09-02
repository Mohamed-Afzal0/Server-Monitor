# 🖥️ Server Monitor Dashboard

A real-time system monitoring tool built with Python and Flask, featuring a live web dashboard, Docker support, and browser alert notifications.

---

## 🚀 Features

- **Live Metrics** — Real-time CPU, Memory, Disk, and Network monitoring
- **Interactive Dashboard** — Clean dark UI with live updating donut charts
- **Browser Alerts** — Toast and push notifications when metrics exceed thresholds
- **REST API** — Clean `/metrics` endpoint serving live data as JSON
- **Dockerized** — Runs anywhere with a single Docker command
- **CI/CD Pipeline** — GitHub Actions automatically builds and tests on every push

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, Flask |
| Monitoring | psutil |
| Frontend | HTML5, CSS3, JavaScript |
| Charts | Chart.js |
| Container | Docker |
| CI/CD | GitHub Actions |

---

## 📦 Prerequisites

- Python 3.8+
- Docker (optional)
- Git

---

## ⚡ Quick Start

### Option 1 — Run with Python

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/server-monitor.git
cd server-monitor

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

Then open your browser at `http://localhost:5000`

---

### Option 2 — Run with Docker

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/server-monitor.git
cd server-monitor

# Build the image
docker build -t server-monitor .

# Run the container
docker run -p 5000:5000 --network=host server-monitor
```

Then open your browser at `http://localhost:5000`

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Dashboard UI |
| `/metrics` | GET | Live system metrics as JSON |

### Sample `/metrics` response:

```json
{
  "timestamp": "2026-04-11T10:00:00",
  "cpu": {
    "usage_percent": 14.9,
    "core_count": 16
  },
  "memory": {
    "total_gb": 15.35,
    "used_gb": 11.19,
    "usage_percent": 72.9
  },
  "disk": {
    "total_gb": 476.01,
    "used_gb": 277.7,
    "usage_percent": 58.3
  },
  "network": {
    "bytes_sent_mb": 56.61,
    "bytes_recv_mb": 2354.4
  }
}
```

---

## 🚨 Alert Thresholds

| Metric | Default Threshold |
|--------|------------------|
| CPU | > 80% |
| Memory | > 85% |
| Disk | > 90% |

Alerts appear as toast notifications in the dashboard and browser push notifications.

---

## 🐳 CI/CD Pipeline

Every push to `main` automatically:
1. Spins up an Ubuntu runner on GitHub Actions
2. Builds the Docker image
3. Runs the container
4. Tests the `/metrics` endpoint

---

## 📁 Project Structure

server-monitor/

├── agent/

│   └── monitor.py       # System metrics collector

├── static/

│   ├── index.html       # Dashboard UI

│   ├── style.css        # Styling

│   └── script.js        # Charts, fetch, alerts

├── .github/

│   └── workflows/

│       └── docker-build.yml  # CI/CD pipeline

├── app.py               # Flask API

├── Dockerfile           # Container config

└── requirements.txt     # Python dependencies

---

## 👤 Author

**Seyed Fazee Mohamed Afzal**
- [GitHub](https://github.com/Mohamed-Afzal0)
- [LinkedIn](https://www.linkedin.com/in/mohamed-afzal-0b7372305/)
- [Portfolio](https://mohamed-afzal-lovat.vercel.app/)
