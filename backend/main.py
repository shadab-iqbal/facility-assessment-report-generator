from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.facility import router as facility_router

app = FastAPI(title="Medelite Facility Assessment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://facility-assessment-report-generato.vercel.app/",  # ← add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(facility_router)
