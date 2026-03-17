from fastapi import FastAPI
from .routers import auth, users
from .database import engine, Base
from .routers import auth, users, detection  # добавили detection
# Создание таблиц (для первого запуска)
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(title="BAIKALBP API")

@app.on_event("startup")
async def on_startup():
    await create_tables()
    
app.include_router(detection.router)
app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "BAIKALBP API is running"}