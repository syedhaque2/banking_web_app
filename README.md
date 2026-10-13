# wallet_web_app

## Quick-Start Guide
### To run the program a developer will need:
- node
- python
- pnpm

### To start the backend the following script should be run:
(from the banking_web_app directory)  
```python -m pip install -r requirements.txt```  
```python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000```

### View wallet addresses for transfers
The send endpoint only transfers to a wallet already registered in the local database, and the recipient must have an account for the selected token. From the `banking_web_app` directory, open the database with:
```text
sqlite3 mock_solana_wallet.db
```
At the SQLite prompt, list registered wallet addresses:
```sql
SELECT address, label FROM wallets;
```
To see which tokens each wallet can receive:
```sql
SELECT w.address, w.label, t.symbol
FROM wallets AS w
JOIN token_accounts AS ta ON ta.wallet_address = w.address
JOIN tokens AS t ON t.mint = ta.mint
ORDER BY w.label, t.symbol;
```
Enter `.quit` to exit SQLite. Use a listed address that has an account for the token you are sending.

### To start the frontend the following script should be run:
(from the banking_web_app/frontend directory)  
```npm install --global pnpm```  
```pnpm install --frozen-lockfile```  
```pnpm dev```

### To run basic unit tests for the API
Run the following command:
```pytest```

### Issues that may be faced:
Currently the way Vite is configured, port 5173 has strcitPort set to 'True' so if the port is busy the program will not work. The /api proxy is set to 8000 so a similar issue will occur if the port is in use. In this instance, vite.config.js must be edited so a different port can be selected. The static port selections are currently in place for testing and prototyping. 

## Project

- How an API works (FastAPI)
- How an API connects with a relational-database
- How a website connects to an API
- How to use GitHub (GitHub Actions)

### Context

Cryptocurrency Wallet App

- Current database schema (`mock_solana_wallet.db`):
    * `wallets`: `address` (primary key), `label`, `is_active`, `created_at`
    * `token_accounts`: `id` (primary key), `wallet_address` (wallet reference), `mint` (token reference), `token_account`, `balance_raw`; each wallet has at most one account per token
    * `tokens`: `mint` (primary key), `symbol`, `name`, `decimals`, `logo_url`, `price_usd`, `change_24h_pct`
    * `transactions`: `signature` (primary key), `wallet_address`, `type` (`send`, `receive`, `swap`, or `stake`), `mint`, `amount_raw`, `counterparty`, optional `swap_to_mint` and `swap_to_amount_raw`, `fee_lamports`, `status` (`confirmed`, `pending`, or `failed`), `slot`, `block_time`
    * `v_portfolio` (view): joins token accounts with token metadata and calculates human-readable balance and USD value; it is derived/read-only, not a table
- Does not have to be extenisve
- Functionally the website should allow a user to:
    * Make transfers
    * Add new wallets
- Frontend:
    * Swap between wallets
    * Balances
    * Transactions for each account
    * Account summary, graph for pnl

### Website
User selects an amount to transfer and the following occurs:
- Click on transfer -> submit transfer details -> API handles transaction
- POST https://bank.com/transfer {from:123, to: 456, amount: £20}
- Current wallet = GET /balance
- Shows transactions
