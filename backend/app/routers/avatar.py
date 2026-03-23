import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from .. import schemas
from ..database import get_db
from ..dependencies import get_current_user
from ..models import User
from ..config import settings   # нам понадобится UPLOAD_DIR, но его пока нет

router = APIRouter(prefix="/users", tags=["users"])

# Определим папку для загрузки аватаров
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "avatars")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Генерируем имя файла
    ext = os.path.splitext(file.filename)[1]
    filename = f"{current_user.id}_{int(datetime.now().timestamp())}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Сохраняем файл
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Формируем URL
    avatar_url = f"/static/avatars/{filename}"
    current_user.avatar_url = avatar_url
    await db.commit()
    await db.refresh(current_user)

    return {"avatar_url": avatar_url}