def advisor_prompt(data):
    return f"""
You are a financial advisor for Indian users.

User Data:
Income: {data['income']}
Expenses: {data['expenses']}
Savings: {data['savings']}
Debt: {data['debt']}

Give:
1. Exact SIP suggestion
2. Budget improvement
3. Simple explanation
"""