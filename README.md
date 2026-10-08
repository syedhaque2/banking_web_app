# wallet_web_app

## Project

- How an API works (FastAPI)
- How an API connects with a relational-database
- How a website connects to an API
- How to use GitHub (GitHub Actions)

## Context

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

## Website
User selects an amount to transfer and the following occurs:
- Click on transfer -> submit transfer details -> API handles transaction
- POST https://bank.com/transfer {from:123, to: 456, amount: £20}
- Current wallet = GET /balance
- Shows transactions
