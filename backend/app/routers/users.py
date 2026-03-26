from fastapi import APIRouter, Depends
from .. import schemas, dependencies
from ..dependencies import get_current_active_user
from ..models import User
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user = Depends(dependencies.get_current_active_user)):
    return current_user

@router.get("/admin")
async def admin_only(current_user = Depends(dependencies.require_role(1))):
    return {"message": "Welcome, admin!"}

@router.get("/balance")
async def get_balance(current_user: User = Depends(get_current_active_user)):
    return {"balance": current_user.balance}

class NicknameUpdate(BaseModel):
    display_name: str

@router.patch("/nickname")
async def update_nickname(
    nickname_data: NicknameUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    current_user.display_name = nickname_data.display_name
    await db.commit()
    return {"message": "Nickname updated", "display_name": current_user.display_name}