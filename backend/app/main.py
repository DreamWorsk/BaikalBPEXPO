from fastapi import FastAPI
from .routers import auth, users, detection, avatar   # добавлен avatar
from .database import engine, Base
from fastapi.staticfiles import StaticFiles
import os

# Создание таблиц
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(title="BAIKALBP API")

app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.on_event("startup")
async def on_startup():
    await create_tables()

app.include_router(detection.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(avatar.router)   # подключаем роутер для аватарок

@app.get("/")
async def root():
    return {"message": "BAIKALBP API is running"}