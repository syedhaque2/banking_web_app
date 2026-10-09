from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3 as sql

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
def get_tokens(address: str):
    conn = sql.connect("mock_solana_wallet.db")
    conn.row_factory = sql.Row
    rows = conn.execute(
        "SELECT * FROM v_portfolio WHERE wallet_address = ?", (address,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
print(get_tokens("h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU"))