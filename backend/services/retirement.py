def retirement_corpus(current_savings, years, inflation=6):
    future = current_savings * ((1 + inflation/100) ** years)
    return round(future, 2)