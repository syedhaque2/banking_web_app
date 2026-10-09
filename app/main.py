from contextlib import closing
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3

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

@app.get("/tokens")
def wallet_tokens():
    database_path = Path(__file__).resolve().parents[1] / "mock_solana_wallet.db"
    with closing(sqlite3.connect(database_path)) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute(
            "SELECT symbol, name, balance, value_usd, change_24h_pct "
            "FROM v_portfolio "
            "WHERE wallet_address = ?",
            ("h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU",),
        )
        rows = cursor.fetchall()

    return [
        {
            "name": r["name"],
            "symbol": r["symbol"],
            "amount": r["balance"],
            "value": round(r["value_usd"], 2),
            "change": f"{r['change_24h_pct']:+.2f}%",
        }
        for r in rows
    ]

    
@app.get("/")
def wallet_selection():
    database_path = Path(__file__).resolve().parents[1] / "mock_solana_wallet.db"
    with closing(sqlite3.connect(database_path)) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute(
            "SELECT wallet_address FROM v_portfolio WHERE wallet_address = ?",
            ("h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU",))
        result = cursor.fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="Wallet not found")

    return {"wallet_address": result["wallet_address"]}
    
