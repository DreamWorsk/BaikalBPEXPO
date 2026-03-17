# app/routers/detection.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from .. import ml_model
from ..schemas import DetectionResult

router = APIRouter(prefix="/detect", tags=["detection"])

# Определите, какие классы считать пластиком
# Например, если все классы – пластик, то plastic_classes = ml_model.class_names
# Или задайте вручную:
plastic_classes = ['plastic', 'PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS']  # пример

@router.post("/", response_model=DetectionResult)
async def detect_plastic(file: UploadFile = File(...)):
    # Проверяем тип файла
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Читаем содержимое файла
        contents = await file.read()
        # Получаем предсказание от модели
        class_name, confidence = ml_model.predict_image_bytes(contents)

        # Определяем, является ли объект пластиком
        is_plastic = class_name in plastic_classes

        return DetectionResult(
            is_plastic=is_plastic,
            confidence=confidence,
            object_type=class_name,
            message="Analysis complete"
        )
    except Exception as e:
        # Логируем ошибку и возвращаем 500
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")