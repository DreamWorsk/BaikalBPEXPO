from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .. import ml_model, plastic_data
from ..schemas import DetectionResult, PlasticInfo
from ..dependencies import get_current_user
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/detect", tags=["detection"])

PLASTIC_CLASSES = ml_model.class_names  # если все классы – пластик

@router.post("/", response_model=DetectionResult)
async def detect_plastic(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        class_name, confidence = ml_model.predict_image_bytes(contents)

        is_plastic = class_name in PLASTIC_CLASSES
        
        # Получаем дополнительную информацию о типе пластика
        plastic_info = None
        if is_plastic:
            info = plastic_data.get_plastic_info(class_name)
            plastic_info = PlasticInfo(**info)
            # Начисляем 1 балл
            current_user.balance += 1
            await db.commit()
            await db.refresh(current_user)

        return DetectionResult(
            is_plastic=is_plastic,
            confidence=confidence,
            object_type=class_name,
            message="Analysis complete",
            plastic_info=plastic_info
        )
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")