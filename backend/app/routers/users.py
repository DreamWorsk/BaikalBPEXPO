from fastapi import APIRouter, Depends
from .. import schemas, dependencies

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.UserOut)
async def read_users_me(current_user = Depends(dependencies.get_current_active_user)):
    return current_user

@router.get("/admin")
async def admin_only(current_user = Depends(dependencies.require_role(1))):
    return {"message": "Welcome, admin!"}