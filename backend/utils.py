import random

def generate_number(digits: int) -> int:
    """Genera un número con la cantidad de cifras indicada."""
    if digits == 1:
        return random.randint(1, 9)
    else:
        return random.randint(10 ** (digits - 1), 10 ** digits - 1)

def generate_operations(mode: str, difficulty: int, count: int):
    """
    Genera una lista de operaciones según el modo y dificultad.

    Dificultad propuesta:
    1 -> 1 cifra
    2 -> 2 cifras (una de un dígito, otra de dos)
    3 -> ambas de dos cifras
    4 -> una de tres cifras, otra de dos
    5 -> ambas de tres cifras
    6 -> una de cuatro, otra de tres
    """
    operations = []
    for _ in range(count):
        # Elegir tipo
        op_type = mode
        if mode == "mix":
            op_type = random.choice(["sum", "sub"])

        # Determinar cifras
        if difficulty == 1:
            a = generate_number(1)
            b = generate_number(1)
        elif difficulty == 2:
            a = generate_number(2)
            b = generate_number(1)
        elif difficulty == 3:
            a = generate_number(2)
            b = generate_number(2)
        elif difficulty == 4:
            a = generate_number(3)
            b = generate_number(2)
        elif difficulty == 5:
            a = generate_number(3)
            b = generate_number(3)
        elif difficulty == 6:
            a = generate_number(4)
            b = generate_number(3)
        else:
            a = generate_number(2)
            b = generate_number(2)

        # Ajuste si es resta para evitar negativos
        if op_type == "sub" and a < b:
            a, b = b, a

        operations.append({
            "a": a,
            "b": b,
            "operator": "+" if op_type == "sum" else "-"
        })

    return operations

