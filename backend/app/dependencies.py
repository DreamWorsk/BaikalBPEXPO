from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from . import models, schemas, auth
from .database import get_db
from .config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception

    result = await db.execute(
        select(models.User).where(models.User.username == token_data.username)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    # Здесь можно добавить проверку активности (например, is_active)
    return current_user

def require_role(required_role: int):
    def role_checker(current_user: models.User = Depends(get_current_active_user)):
        if current_user.role != required_role:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        return current_user
    return role_checker