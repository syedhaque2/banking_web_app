import sqlite3
from decimal import Decimal

import pytest
from fastapi import HTTPException

import main


SENDER_ADDRESS = "test-sender"
RECIPIENT_ADDRESS = "test-recipient"
BONK_MINT = "test-bonk-mint"
INITIAL_SENDER_BALANCE = 120_300_000


@pytest.fixture
def test_database(tmp_path, monkeypatch):
    database_path = tmp_path / "test_wallet.db"
    with sqlite3.connect(database_path) as connection:
        connection.executescript(
            """
            CREATE TABLE wallets (
                address TEXT PRIMARY KEY,
                label TEXT NOT NULL
            );
            CREATE TABLE tokens (
                mint TEXT PRIMARY KEY,
                symbol TEXT NOT NULL,
                name TEXT NOT NULL,
                decimals INTEGER NOT NULL,
                price_usd REAL NOT NULL,
                change_24h_pct REAL NOT NULL
            );
            CREATE TABLE token_accounts (
                id INTEGER PRIMARY KEY,
                wallet_address TEXT NOT NULL,
                mint TEXT NOT NULL,
                balance_raw INTEGER NOT NULL
            );
            CREATE VIEW v_portfolio AS
            SELECT
                ta.wallet_address,
                t.symbol,
                t.name,
                ta.balance_raw / 100.0 AS balance,
                ta.balance_raw / 100.0 * t.price_usd AS value_usd,
                t.change_24h_pct
            FROM token_accounts AS ta
            JOIN tokens AS t ON t.mint = ta.mint;
            """
        )
        connection.executemany(
            "INSERT INTO wallets (address, label) VALUES (?, ?)",
            [
                (SENDER_ADDRESS, "Test sender"),
                (RECIPIENT_ADDRESS, "Test recipient"),
            ],
        )
        connection.execute(
            "INSERT INTO tokens VALUES (?, ?, ?, ?, ?, ?)",
            (BONK_MINT, "BONK", "Bonk", 2, 0.0000214547, -6.84),
        )
        connection.executemany(
            "INSERT INTO token_accounts (wallet_address, mint, balance_raw) "
            "VALUES (?, ?, ?)",
            [
                (SENDER_ADDRESS, BONK_MINT, INITIAL_SENDER_BALANCE),
                (RECIPIENT_ADDRESS, BONK_MINT, 0),
            ],
        )

    monkeypatch.setattr(main, "DATABASE_PATH", database_path)
    monkeypatch.setattr(main, "selected_address", SENDER_ADDRESS)
    return database_path


def test_wallet_tokens(test_database):
    assert main.wallet_tokens(SENDER_ADDRESS) == [
        {
            "name": "Bonk",
            "symbol": "BONK",
            "amount": 1_203_000.0,
            "value": 25.81,
            "change": "-6.84%",
        }
    ]


def test_wallet_address(test_database):
    assert main.wallet_address(SENDER_ADDRESS) == {
        "wallet_address": SENDER_ADDRESS
    }


def test_transfer_funds(test_database):
    result = main.transfer_funds(
        RECIPIENT_ADDRESS,
        Decimal("100"),
        "BONK",
    )

    assert result == {
        "message": f"Successfully transferred 100 BONK to {RECIPIENT_ADDRESS}"
    }
    with sqlite3.connect(test_database) as connection:
        balances = dict(
            connection.execute(
                "SELECT wallet_address, balance_raw FROM token_accounts"
            ).fetchall()
        )

    assert balances == {
        SENDER_ADDRESS: INITIAL_SENDER_BALANCE - 10_000,
        RECIPIENT_ADDRESS: 10_000,
    }


def test_wallet_address_not_found(test_database):
    with pytest.raises(HTTPException) as error:
        main.wallet_address("invalid-wallet")

    assert error.value.status_code == 404
    assert error.value.detail == "Wallet not found"
