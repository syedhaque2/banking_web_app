from contextlib import closing
from decimal import Decimal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3

app = FastAPI(
    title="Crypto Wallet API",
    version="1.0.0"
)

# uses cors to allow requests from frontend running on :5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# endpoint to get list of tokens in wallet, currently hardcoded to a specific wallet
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

# endpoint gets wallet address, currently hardcoded so effectively redundant currently   
@app.get("/wallet")
def wallet_address():
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

@app.post("/send")
def transfer_funds(targetaddress: str, amount: Decimal, token: str):
    if not amount.is_finite() or amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")
    
    database_path = Path(__file__).resolve().parents[1] / "mock_solana_wallet.db"
    with closing(sqlite3.connect(database_path)) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        #effectively reverse of the calculation performed in the frontend to get the raw amount of the token to be transferred, and checks if the sender has enough balance
        cursor.execute(
            "SELECT ta.mint, ta.balance_raw, t.decimals "
            "FROM token_accounts ta "
            "JOIN tokens t ON t.mint = ta.mint "
            "WHERE ta.wallet_address = ? AND t.symbol = ?",
            ("h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU", token),
        )

        sender_account = cursor.fetchone()
        if sender_account is None:
            raise HTTPException(status_code=404, detail="Token not found in sender wallet")

        amount_raw_decimal = amount * (10 ** sender_account["decimals"])
        if amount_raw_decimal != amount_raw_decimal.to_integral_value():
            raise HTTPException(
                status_code=400,
                detail="Amount has more decimal places than this token supports",
            )
        amount_raw = int(amount_raw_decimal)
        if sender_account["balance_raw"] < amount_raw:
            raise HTTPException(status_code=400, detail="Insufficient token balance")

        cursor.execute(
            "SELECT 1 FROM wallets WHERE address = ?",
            (targetaddress,),
        )
        if cursor.fetchone() is None:
            raise HTTPException(
                status_code=404,
                detail="Recipient wallet is not registered in the local database",
            )

        cursor.execute(
            "SELECT id FROM token_accounts WHERE wallet_address = ? AND mint = ?",
            (targetaddress, sender_account["mint"]),
        )
        recipient_account = cursor.fetchone()
        if recipient_account is None:
            raise HTTPException(
                status_code=400,
                detail="Recipient wallet does not have an account for this token",
            )

        cursor.execute(
            "UPDATE token_accounts SET balance_raw = balance_raw - ? "
            "WHERE wallet_address = ? AND mint = ? AND balance_raw >= ?",
            (
                amount_raw,
                "h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU",
                sender_account["mint"],
                amount_raw,
            ),
        )
        if cursor.rowcount != 1:
            raise HTTPException(status_code=400, detail="Insufficient token balance")
        cursor.execute(
            "UPDATE token_accounts SET balance_raw = balance_raw + ? WHERE id = ?",
            (amount_raw, recipient_account["id"]),
        )
        connection.commit()

    return {"message": f"Successfully transferred {amount} {token} to {targetaddress}"}

@app.get("/activity")
def wallet_activity():
    database_path = Path(__file__).resolve().parents[1] / "mock_solana_wallet.db"
    with closing(sqlite3.connect(database_path)) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute(
            "SELECT tr.signature AS transaction_id, "
            "datetime(tr.block_time, 'unixepoch') AS timestamp, "
            "tr.amount_raw, t.decimals, "
            "t.symbol AS token_symbol, tr.type AS direction, tr.status "
            "FROM transactions AS tr "
            "JOIN tokens AS t ON t.mint = tr.mint "
            "WHERE tr.wallet_address = ? "
            "ORDER BY tr.block_time DESC",
            ("h82pJGF9p7kpzb6eU326EFZf2cDnimbTFVeJtx1qtBmU",),
        )
        rows = cursor.fetchall()

    return [
        {
            "transaction_id": r["transaction_id"],
            "timestamp": r["timestamp"],
            "amount": r["amount_raw"] / (10 ** r["decimals"]),
            "token_symbol": r["token_symbol"],
            "direction": r["direction"],
            "status": r["status"],
        }
        for r in rows
    ]