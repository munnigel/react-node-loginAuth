from fastapi import FastAPI, UploadFile, HTTPException, File, APIRouter

from fastapi.responses import JSONResponse
from keras.models import model_from_json
import numpy as np
from PIL import Image
import io
import os

router = APIRouter()

# Load the model
current_directory = os.path.dirname(os.path.abspath(__file__))
fer_json_path = os.path.join(current_directory, "fer.json")
model = model_from_json(open(fer_json_path, "r").read())

current_directory = os.path.dirname(os.path.abspath(__file__))
fer_h5_path = os.path.join(current_directory, "fer.h5")
model.load_weights(fer_h5_path)
emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

@router.post("/api/predict/")
async def predict(file: UploadFile = File(...)):
    try:
          # Read the image
        image = Image.open(file.file).convert("L")  # Convert to grayscale
        image = image.resize((48, 48))  # Resize to the expected input size
        image_array = np.asarray(image) / 255.0  # Convert to numpy array and normalize
        image_array = np.expand_dims(image_array, axis=-1)  # Add channel dimension
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Predict using the model
        predictions = model.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1)[0]
        emotion = emotions[predicted_class]
        confidence = float(predictions[0][predicted_class])  # Confidence level of the prediction
        print(emotion, confidence)

        return {"emotion": emotion, "confidence": confidence}

    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
