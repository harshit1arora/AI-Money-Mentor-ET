def generate_plan(income, expenses):
    savings = income - expenses

    return {
        "emergency_fund": savings * 0.4,
        "sip": savings * 0.4,
        "insurance": savings * 0.2
    }