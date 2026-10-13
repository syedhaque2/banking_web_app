from main import wallet_tokens, wallet_address, transfer_funds
from decimal import Decimal
def test_wallet_tokens():
    assert wallet_tokens("NJAEqN76R7PwPfHt3oWb8R6cKvhgyxQdDn53jFrK6wFx") == [
        {
            "name": "Bonk",
            "symbol": "BONK",
            "amount": 1200000.0,
            "value": 25.8,
            "change": "-6.84%",
        },
                {
            "name": "USD Coin",
            "symbol": "USDC",
            "amount": 890.12,
            "value": 890.12,
            "change": "+0.01%",
        },
                {
            "name": "Jupiter",
            "symbol": "JUP",
            "amount": 300.0,
            "value": 252.0,
            "change": "+4.12%",
        },
                {
            "name": "Solana",
            "symbol": "SOL",
            "amount": 3.05,
            "value": 434.23,
            "change": "+2.41%",
        }

    ]

def test_wallet_address():
    assert wallet_address("NJAEqN76R7PwPfHt3oWb8R6cKvhgyxQdDn53jFrK6wFx") == {"wallet_address": "NJAEqN76R7PwPfHt3oWb8R6cKvhgyxQdDn53jFrK6wFx"}

def test_transfer_funds():
    assert transfer_funds("NJAEqN76R7PwPfHt3oWb8R6cKvhgyxQdDn53jFrK6wFx", Decimal("100"), "BONK") == {"message": "Successfully transferred 100 BONK to NJAEqN76R7PwPfHt3oWb8R6cKvhgyxQdDn53jFrK6wFx"}
