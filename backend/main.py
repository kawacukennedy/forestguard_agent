from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import upload, incidents, agents, notify, auth

app = FastAPI(title="ForestGuard Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(incidents.router, prefix="/api", tags=["incidents"])
app.include_router(agents.router, prefix="/api", tags=["agents"])
app.include_router(notify.router, prefix="/api", tags=["notify"])

@app.get("/")
async def root():
    return {"message": "ForestGuard Agent API"}