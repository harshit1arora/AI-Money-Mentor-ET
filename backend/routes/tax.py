from fastapi import APIRouter

router = APIRouter()

@router.get("/basic")
def get_tax(income: float):
    # Old Regime (FY 2024-25)
    # 0-2.5L: Nil
    # 2.5-5L: 5%
    # 5-10L: 20%
    # >10L: 30%
    old_taxable = max(0, income - 50000) # Standard deduction
    if old_taxable <= 250000:
        old_tax = 0
    elif old_taxable <= 500000:
        old_tax = (old_taxable - 250000) * 0.05
    elif old_taxable <= 1000000:
        old_tax = 12500 + (old_taxable - 500000) * 0.2
    else:
        old_tax = 112500 + (old_taxable - 1000000) * 0.3

    # New Regime (FY 2025-26 as per latest budget)
    # 0-3L: Nil
    # 3-7L: 5%
    # 7-10L: 10%
    # 10-12L: 15%
    # 12-15L: 20%
    # >15L: 30%
    new_taxable = max(0, income - 75000) # Standard deduction
    if new_taxable <= 300000:
        new_tax = 0
    elif new_taxable <= 700000:
        new_tax = (new_taxable - 300000) * 0.05
    elif new_taxable <= 1000000:
        new_tax = 20000 + (new_taxable - 700000) * 0.1
    elif new_taxable <= 1200000:
        new_tax = 50000 + (new_taxable - 1000000) * 0.15
    elif new_taxable <= 1500000:
        new_tax = 80000 + (new_taxable - 1200000) * 0.2
    else:
        new_tax = 140000 + (new_taxable - 1500000) * 0.3

    return {
        "income": income,
        "old_regime_tax": old_tax,
        "new_regime_tax": new_tax,
        "recommendation": "New" if new_tax < old_tax else "Old",
        "savings": abs(old_tax - new_tax)
    }