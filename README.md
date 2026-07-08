# 🥔 Potato Disease Prediction using CNN

A deep learning web application that detects diseases in potato plants from leaf images using a Convolutional Neural Network (CNN). Upload a photo of a potato leaf and get an instant prediction — **Healthy**, **Early Blight**, or **Late Blight** — helping farmers and agronomists catch crop disease early.

**🔗 Live Demo:** [potato-disease-ui-51mi.onrender.com](https://potato-disease-ui-51mi.onrender.com/)

> ⚠️ Note: The app is hosted on Render's free tier, so the backend may take 30–60 seconds to spin up on the first request after a period of inactivity.

---

## 📖 Overview

Potato crops are highly vulnerable to **Early Blight** and **Late Blight**, two fungal diseases that can significantly reduce yield if not caught early. This project trains a CNN on labeled leaf images to automatically classify a leaf's health status, then exposes that model through a REST API and a simple, responsive web UI — turning manual visual inspection into a one-click prediction.

## ✨ Features

- 🧠 CNN-based image classifier trained on potato leaf images
- 📤 Upload a leaf image and get a real-time disease prediction
- ⚡ Lightweight Python backend serving the trained model
- 💻 Clean React (Vite) frontend for image upload and result display
- 🐳 Dockerized for consistent local and cloud deployment
- ☁️ Deployed and publicly accessible on Render

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Model Training** | TensorFlow / Keras, CNN |
| **Backend / API** | Python (served via `api/main.py`) |
| **Frontend** | React + Vite |
| **Containerization** | Docker |
| **Deployment** | Render |

## 📂 Project Structure

```
Potato-Disease-Prediction-using-CNN-DEEP-LEARNING-/
├── Frontend/            # React + Vite web application (UI)
├── api/                 # Backend service that loads the trained model and serves predictions
├── potato-disease/      # Model training notebooks / saved & serving models
├── convert_model.py     # Converts a trained .keras model to TensorFlow SavedModel format
├── Dockerfile           # Container definition for building and running the backend
└── README.md
```

## 🧠 How It Works

1. **Training** – A CNN is trained on a labeled dataset of potato leaf images (healthy, early blight, late blight) inside the `potato-disease/` directory.
2. **Conversion** – `convert_model.py` exports the trained `.keras` model into the TensorFlow `SavedModel` format for optimized serving.
3. **Serving** – The `api/` service loads the exported model and exposes an endpoint that accepts an image and returns the predicted class with a confidence score.
4. **UI** – The `Frontend/` React app lets users upload a leaf photo, sends it to the API, and displays the prediction.

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Docker (optional, for containerized run)

### 1. Clone the repository

```bash
git clone https://github.com/om-rajale/Potato-Disease-Prediction-using-CNN-DEEP-LEARNING-.git
cd Potato-Disease-Prediction-using-CNN-DEEP-LEARNING-
```

### 2. Run the backend

```bash
cd api
pip install -r requirements.txt
python main.py
```

The API will start on `http://localhost:8000`.

### 3. Run the frontend

```bash
cd Frontend
npm install
npm run dev
```

The UI will be available at the local Vite dev server URL (typically `http://localhost:5173`).

### 4. Run with Docker (backend)

From the project root:

```bash
docker build -t potato-disease-api .
docker run -p 8000:8000 potato-disease-api
```

## 🖼️ Usage

1. Open the app (locally or via the [live demo](https://potato-disease-ui-51mi.onrender.com/)).
2. Upload or drag-and-drop an image of a potato leaf.
3. Get an instant prediction along with the model's confidence score.

## 🗺️ Roadmap

- [ ] Add training/evaluation metrics and confusion matrix to the README
- [ ] Support batch image predictions
- [ ] Add automated tests for the API
- [ ] Improve mobile responsiveness of the UI

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project currently has no license file. Consider adding an [MIT License](https://choosealicense.com/licenses/mit/) if you'd like others to freely use and contribute to this project.

## 👤 Author

**Om Rajale**
GitHub: [@om-rajale](https://github.com/om-rajale)

---

⭐ If you found this project useful, consider giving it a star on GitHub!
