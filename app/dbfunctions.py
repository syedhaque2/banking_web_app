import sqlite3 as sql
import os

print(os.getcwd())

sqlConnection = sql.connect("crypto_wallets.db")

cursor = sqlConnection.cursor()

statement = "SELECT * FROM crypto_wallets"

cursor.execute(statement)

results = cursor.fetchall()

print(results)

sqlConnection.close()