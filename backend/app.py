from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import generate_operations
import random

app = FastAPI(title="Math Practice API")

# CORS para permitir conexión desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estado temporal de sesiones en memoria
sessions = {}

class Settings(BaseModel):
    mode: str           # "sum", "sub", "mix"
    difficulty: int     # 1..6
    total_operations: int  # 10, 20, 30, 40, 50

@app.post("/api/start")
def start_session(settings: Settings):
    """Inicia una nueva sesión con las configuraciones del usuario."""
    session_id = str(random.randint(100000, 999999))
    operations = generate_operations(
        mode=settings.mode,
        difficulty=settings.difficulty,
        count=settings.total_operations
    )
    sessions[session_id] = {
        "operations": operations,
        "index": 0,
        "results": []
    }
    return {"session_id": session_id, "total": len(operations)}

@app.get("/api/next/{session_id}")
def next_operation(session_id: str):
    """Devuelve la siguiente operación de la sesión."""
    session = sessions.get(session_id)
    if not session:
        return {"error": "Sesión no encontrada"}
    idx = session["index"]
    if idx >= len(session["operations"]):
        return {"finished": True, "results": session["results"]}
    return {
        "finished": False,
        "operation": session["operations"][idx],
        "index": idx + 1,
        "total": len(session["operations"])
    }

@app.post("/api/answer/{session_id}")
def submit_answer(session_id: str, data: dict):
    """Registra si el niño respondió correctamente o no."""
    session = sessions.get(session_id)
    if not session:
        return {"error": "Sesión no encontrada"}

    correct = data.get("correct", False)
    session["results"].append(correct)
    session["index"] += 1

    if session["index"] >= len(session["operations"]):
        return {"finished": True, "results": session["results"]}
    else:
        op = session["operations"][session["index"]]
        return {"finished": False, "operation": op}

