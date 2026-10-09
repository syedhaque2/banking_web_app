from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3 as sqlite3

app = FastAPI(
    title="Crypto Wallet API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def wallet_tokens():
    sqlConnection = sqlite3.connect("mock_solana_wallet.db")
    sqlConnection.row_factory = sqlite3.Row
    cursor = sqlConnection.cursor()
    cursor.execute("SELECT symbol, name, balance, value_usd, change_24h_pct FROM v_portfolio WHERE wallet_address = 'h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU'")
    rows = cursor.fetchall()
    sqlConnection.close()

    return [
        {
            "name": r["name"],
            "symbol": r["symbol"],
            "amount": f"{r['balance']:,.2f}",
            "value": round(r["value_usd"], 2),
            "change": f"{r['change_24h_pct']:+.2f}%",
        }
        for r in rows
    ]
