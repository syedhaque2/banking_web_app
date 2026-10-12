# wallet_web_app

## Project

- How an API works (FastAPI)
- How an API connects with a relational-database
- How a website connects to an API
- How to use GitHub (GitHub Actions)

### Context

Cryptocurrency Wallet App

- Tables needed in database:
    * Wallets: <u>address</u>, transactions, balance, 
    * Transactions : <u>transactionID</u>, senderaddress, recipientaddress, tokensent, amountsent, gasfee
    * Tokens: <u>ticker</u>, price, marketcap, supply
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

## Quick-Start Guide
### To run the program a developer will need:
- node
- python
- pnpm

### To start the backend the following script should be run:
(from the banking_web_app directory)
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

### To start the frontend the following script should be run:
(from the banking_web_app/frontend directory)
npm install --global pnpm
pnpm install --frozen-lockfile
pnpm dev

### Issues that may be faced:
Currently the way Vite is configured, port 5173 has strcitPort set to 'True' so if the port is busy the program will not work. The /api proxy is set to 8000 so a similar issue will occur if the port is in use. In this instance, vite.config.js must be edited so a different port can be selected. The static port selections are currently in place for testing and prototyping. 