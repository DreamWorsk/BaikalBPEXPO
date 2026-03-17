# app/ml_model.py
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import io
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'plastic_classifier.h5')
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), 'models', 'class_names.txt')

# Загружаем модель при импорте модуля (один раз)
model = load_model(MODEL_PATH)

# Загружаем имена классов
with open(CLASS_NAMES_PATH, 'r') as f:
    class_names = [line.strip() for line in f.readlines()]

# Размер, ожидаемый моделью
IMG_SIZE = (224, 224)

def predict_image_bytes(image_bytes):
    """
    Принимает байты изображения, возвращает предсказанный класс и уверенность.
    """
    # Открываем изображение из байтов
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)[0]
    class_index = int(np.argmax(predictions))
    confidence = float(predictions[class_index])
    class_name = class_names[class_index]

    return class_name, confidence