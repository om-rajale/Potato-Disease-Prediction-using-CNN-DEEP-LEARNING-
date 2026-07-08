import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# Updated CORS to be a bit more flexible or match your production URL later
origins = [
    "http://localhost",
    "http://localhost:3000",
    "*", # Allows external frontend frameworks to connect
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "potato-disease", "saved_model", "1")

# Use TFSMLayer to parse the legacy TensorFlow SavedModel folder format
tf_layer = tf.keras.layers.TFSMLayer(MODEL_PATH, call_endpoint='serving_default')
MODEL = tf.keras.Sequential([tf_layer])

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    # 1. Get the dictionary output from TFSMLayer
    predictions_dict = MODEL.predict(img_batch)
    
    # 2. Extract the raw array from the default output key
    # TFSMLayer wraps outputs inside keys named after the serving endpoint
    output_key = list(predictions_dict.keys())[0] 
    predictions = predictions_dict[output_key]

    # 3. Process the extracted array just like before
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

# FIX 2: Bind to 0.0.0.0 and dynamically grab Render's PORT environment variable
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host='0.0.0.0', port=port)