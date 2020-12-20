Index redeeming
=============

The only precondition for redeeming the index token for its components is for the caller to have [minted](./minting.md) some balance of said index token.

Redeem by executing `node scripts/poc.js redeemSet <symbol> <amount>`

This'll reduce your Index balance by `amount`, or set your balance to zero if you don't provide an amount, and transfer your share of all of the components of the index to your wallet.

No allowances need to be configured, however, if the set was rebalanced to add a new token since your last mint, you might need to configure an allowance to mint again.
