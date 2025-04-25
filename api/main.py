from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import  auth


app = FastAPI(title="I2Global Brand Studio API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication"])


@app.get("/")
def read_root():
    return {"message": "Welcome to I2Global API"}