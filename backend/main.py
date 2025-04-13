from fastapi import FastAPI
from backend.routes import alert_routes

app = FastAPI()

app.include_router(alert_routes.router, prefix="/alerts", tags=["alerts"])

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
