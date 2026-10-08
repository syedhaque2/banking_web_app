def deduction(amount, balance, gasfee):
        try:
            if amount + gasfee > balance:
                raise ValueError("Insufficient balance for the transaction.")
            return balance - (amount + gasfee)
        except ValueError as e:
            print(e)
            return balance

def increase(amount, balance):
        try:
            if amount < 0:
                raise ValueError("Amount to increase must be non-negative.")
            return balance + amount
        except ValueError as e:
            print(e)
            return balance