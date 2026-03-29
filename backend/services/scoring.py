def calculate_score(income, expenses, savings, debt):
    score = 0

    if savings >= 6 * expenses:
        score += 20

    if debt < income * 0.3:
        score += 20

    if savings > 0:
        score += 20

    if expenses < income:
        score += 20

    score += 20

    return score