import sqlite3 as sql



sqlConnection = sql.connect("crypto_wallets.db")

cursor = sqlConnection.cursor()

statement = "SELECT * FROM crypto_wallets"

cursor.execute(statement)

results = cursor.fetchall()

print(results)

sqlConnection.close()

def transaction(senderID, receiverID, amount, gasfee):
    try:
        sqlConnection = sql.connect("crypto_wallets.db")
        cursor = sqlConnection.cursor()

        cursor.execute("SELECT balance FROM crypto_wallets WHERE id = ?", (senderID,))
        sender_balance = cursor.fetchone()
        if sender_balance is None:
            raise ValueError("Sender ID not found.")
        sender_balance = sender_balance[0]

        cursor.execute("SELECT balance FROM crypto_wallets WHERE id = ?", (receiverID,))
        receiver_balance = cursor.fetchone()
        if receiver_balance is None:
            raise ValueError("Receiver ID not found.")
        receiver_balance = receiver_balance[0]

        new_sender_balance = deduction(amount, sender_balance, gasfee)
        new_receiver_balance = increase(amount, receiver_balance)

        cursor.execute("UPDATE crypto_wallets SET balance = ? WHERE id = ?", (new_sender_balance, senderID))
        cursor.execute("UPDATE crypto_wallets SET balance = ? WHERE id = ?", (new_receiver_balance, receiverID))

        sqlConnection.commit()

    except ValueError as e:
        print(e)
    finally:
        sqlConnection.close()

def get_wallet_tokens():
    
    sqlConnection = sql.connect("mock_solana_wallet.db")
    sqlConnection.row_factory = sql.Row
    cursor = sqlConnection.cursor()
    cursor.execute(f"SELECT symbol, name, balance FROM v_portfolio WHERE wallet_address = h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU")
    rows = cursor.fetchall()
    print([dict(r) for r in rows])
        
    sqlConnection.close()
