import random
from typing import Dict, Iterable, List, Tuple


def generate_number(digits: int) -> int:
    """Genera un número con la cantidad de cifras indicada."""
    if digits == 1:
        return random.randint(1, 9)
    return random.randint(10 ** (digits - 1), 10**digits - 1)


def _difficulty_stages(difficulty: int) -> List[Tuple[int, int]]:
    """Devuelve las etapas de dificultad para una sesión."""

    stages: Dict[int, Iterable[Tuple[int, int]]] = {
        1: [(1, 1)],
        2: [(1, 1), (2, 1)],
        3: [(1, 1), (2, 1), (2, 2)],
        4: [(2, 1), (2, 2), (3, 2)],
        5: [(2, 2), (3, 2), (3, 3)],
        6: [(3, 2), (3, 3), (4, 3)],
    }

    return list(stages.get(difficulty, stages[3]))


def _expected_result(a: int, b: int, operator: str) -> int:
    return a + b if operator == "+" else a - b


def generate_operations(mode: str, difficulty: int, count: int):
    """Genera una lista de operaciones según el modo y la dificultad.

    Cada sesión avanza gradualmente por etapas, incrementando la cantidad de cifras
    hasta alcanzar la dificultad seleccionada.
    """

    stages = _difficulty_stages(difficulty)
    operations = []

    for index in range(count):
        # Elegir tipo de operación
        op_type = mode
        if mode == "mix":
            op_type = random.choice(["sum", "sub"])

        # Calcular etapa correspondiente (progresión gradual)
        progress = (index + 1) / max(1, count)
        stage_idx = min(len(stages) - 1, max(0, int(progress * len(stages)) - 1))
        digits_a, digits_b = stages[stage_idx]

        a = generate_number(digits_a)
        b = generate_number(digits_b)

        operator = "+" if op_type == "sum" else "-"

        # Ajuste si es resta para evitar resultados negativos
        if operator == "-" and a < b:
            a, b = b, a

        operations.append(
            {
                "a": a,
                "b": b,
                "operator": operator,
                "result": _expected_result(a, b, operator),
            }
        )

    return operations

