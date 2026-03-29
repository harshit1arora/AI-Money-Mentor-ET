def calculate_sip(monthly, rate, months):
    r = rate / 12 / 100
    fv = monthly * (((1 + r) ** months - 1) / r)
    return round(fv, 2)