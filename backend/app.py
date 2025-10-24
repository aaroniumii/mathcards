from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from utils import generate_operations
import random


class AnswerPayload(BaseModel):
    answer: int

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
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    idx = session["index"]
    if idx >= len(session["operations"]):
        last = session["results"][-1] if session["results"] else None
        return {
            "finished": True,
            "results": session["results"],
            "total": len(session["operations"]),
            "last_result": last,
        }
    current = session["operations"][idx]
    operation = {key: current[key] for key in ("a", "b", "operator")}
    return {
        "finished": False,
        "operation": operation,
        "index": idx + 1,
        "total": len(session["operations"]),
        "results": session["results"],
    }

@app.post("/api/answer/{session_id}")
def submit_answer(session_id: str, data: dict):
    """Verifica la respuesta enviada por el niño y registra el resultado."""
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    try:
        payload = AnswerPayload(**data)
    except ValidationError:
        raise HTTPException(status_code=400, detail="Respuesta inválida")

    idx = session["index"]
    if idx >= len(session["operations"]):
        last = session["results"][-1] if session["results"] else None
        return {
            "finished": True,
            "results": session["results"],
            "total": len(session["operations"]),
            "last_result": last,
        }

    current = session["operations"][idx]
    expected = current.get("result")
    is_correct = payload.answer == expected

    session["results"].append(
        {
            "correct": is_correct,
            "answer": payload.answer,
            "expected": expected,
            "operation": {key: current[key] for key in ("a", "b", "operator")},
        }
    )
    session["index"] += 1

    if session["index"] >= len(session["operations"]):
        return {
            "finished": True,
            "results": session["results"],
            "total": len(session["operations"]),
            "last_result": session["results"][-1],
        }

    next_operation = session["operations"][session["index"]]
    operation = {key: next_operation[key] for key in ("a", "b", "operator")}
    return {
        "finished": False,
        "operation": operation,
        "index": session["index"] + 1,
        "total": len(session["operations"]),
        "results": session["results"],
        "last_result": session["results"][-1],
    }

