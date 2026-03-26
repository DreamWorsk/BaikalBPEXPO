from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: int
    created_at: Optional[datetime]
    avatar_url: Optional[str]
    balance: int   # <-- добавить
    display_name: Optional[str]

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    login: str  # может быть username или email
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[int] = None
    
class PlasticInfo(BaseModel):
    name: str
    marking: str
    description: str
    decomposition_years: str
    recycling_tips: str
    can_recycle: bool
    recycled_into: str
    icon: str

class DetectionResult(BaseModel):
    is_plastic: bool
    confidence: float
    object_type: Optional[str] = None
    message: Optional[str] = None
    plastic_info: Optional[PlasticInfo] = None  # добавили это поле