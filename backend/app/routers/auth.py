from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.Token)
async def register(user_data: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Проверка уникальности username и email
    result = await db.execute(
        select(models.User).where(
            or_(models.User.username == user_data.username, models.User.email == user_data.email)
        )
    )
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    hashed_password = auth.get_password_hash(user_data.password)
    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        role=2, # обычный пользователь
        balance=10  # приветственный бонус
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Создаём токен
    access_token = auth.create_access_token(data={"sub": new_user.username, "role": new_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
async def login(login_data: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    # Поиск пользователя по username или email
    result = await db.execute(
        select(models.User).where(
            or_(models.User.username == login_data.login, models.User.email == login_data.login)
        )
    )
    user = result.scalar_one_or_none()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect login or password")

    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}