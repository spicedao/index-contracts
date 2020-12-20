# Reference

High-level functions
====================

Functions in the script file can be invoked via the command line.
'High level' functions are those that operate on one of the index tokens defined in `sets.json`, and `createToken`, which adds a new index token.

`node scripts/poc.js functionName SYMBOL [...other args]`

'createToken' Function
============
**parameters:** symbol, name, componentsFile

`node scripts/poc.js createToken SCIFI "SCIFI token" components.json`

Creates an index token calling the ContractCreator, and initializes the Trade and BasicIssuance modules.
The components file should be a JSON file with `tokens` and `units` keys defining the token composition. Examples for mainnet (`components.example.mainnet.json`) and kovan (`components.example.kovan.json`) are provided. (Broadcasts a total of three transactions)

Updates the `sets.json` file with the token's address.

Technically (as in: in the codebase) it's a low-level function. But this should only matter if you're trying to extend the scripts.

'getTokenInfo' Function
============
**parameters:** symbol

example invocation:
`node scripts/poc.js getTokenInfo SCIFI`

Logs, in the following order:
- Token address, name and symbol
- Module list
- Positions (list of tokens and units)
- Index balance of address in use
- Balance, allowance of each ERC20 component, as reported by the Index

'trade' Function
=====
**parameters:** symbol, sourceToken, sourceUnits, targetToken, minTargetUnits
**optional parameters:** slippage=5

**Note:** This only works on mainnet, if you want to perform tests you'll have to run a [forked mainnet node](./setup.md)

Trades a component token for another token.
The latter can already be a component or be a new token to add to the component list. Additionally, it's possible to sell all of a token's units and effectively remove it from the component list.

The amount of _units_ to be subtracted/added should be provided, and the script and contracts will take care of converting it to the actual amount of the component token.

- Source token: the token whose share of the index you want to decrease
- Source units: how many units (as set in the *components file* ) should be traded for the target token
- Target token: the token that you want to add as a component (or whose share you want to increase)
- Min return amount: how many units of the target token are expected as a minimum return. The 'trade' transaction will revert if the exchange returns less than this
- Slippage: how much of a price variation can the trade cause before reverting. This will be important with large transactions, but a default value of 5% will be used by default if this parameter is omitted

The amount of *units* to be subtracted/added should be provided, and the script and contracts will take care of converting it to the actual amount of the component token.

**Warning:** It is of **critical importance** for you to research the exchange rates before trading with production assets and set sane min return and slippage values accordingly. Consider possible consequences of someone front-running a large volume transaction as well.

Ideally you should set the slippage so it matches with the 'min return amount'.
For example if you want to trade 100 units of token A which is currently equivalent to 100 units of token B, but such a big transaction is expected to sway the price by 7%, you should (giving some extra margin) call:

 

    node scripts/poc.js trade tokenAaddress  100 tokenBAddress 92 8

However, if a better price is available, the transaction will execute at that better price. The minReturn parameter is only a protection against front-running or unexpected changes in price.

Possible errors
---------------
The most usual error with this method is a transaction revert with the error `min amount quantity mismatch`, which is caused by the exchange returning less than `min return amount`. You can work around it by lowering this amount.

A little example
----------------

For example, if we had a token that maps 1:1 to WETH:



    components: [wethAddress]
    units: [10**18]

and wanted to trade 50% of the locked WETH for another token, valued at 2 ETH, we should invoke



    node scripts/poc.js trade wethAddress 5*10**17 otherTokenAddress 2.49*10**17

leaving some room for slippage

Be mindful that the tool doesn't parse the math expressions, so a typical invocation looks like this:



    node scripts/poc.js trade 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2  11247276025800 0x2b591e99afe9f32eaa6214f7b7629768c40eeb39 58000000

**Warning:** This method calls 1inch's API to generate the calldata to properly route the exchange. If we wanted to run the trade in a trust-minimized way we should further improve the scripts to compute this calldata ourselves

'allowTokens' Function
===========
**parameters:** symbol
**optional parameters:** amount=10

example invocation:
`node scripts/poc.js allowTokens SCIFI`

Sets an allowance for all of the index's components

**Note:** This broadcasts as many transactions as the index has components, and may take a while to execute.

'mintSet' Function
=======
**parameters:** symbol
**optional parameters:** amount=0.01

example invocation:
`node scripts/poc.js mintSet SCIFI 10000000000000000000`

Mints the provided amount of Index tokens

'redeemSet' Function
=========
**parameters:** symbol
**optional parameters:** amount
Preconditions: some amount of tokens have been minted

Example invocation:
`node scripts/poc.js redeemSet SCIFI 5000000000000000000`

Redeems the provided amount of the address' Index balance.  
Redeems the entire balance if an amount isn't provided

===================
Low-level functions
===================
These perform individual actions, don't directly use the already defined indexes, and don't take a token's symbol as a first parameter.

'mintWeth' Function
========
**parameters:** (weth token address)
**optional parameters:** amount=0.01

example invocation:
`node scripts/poc.js mintWeth 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 100000000000000000`

Mints the provided amount of WETH

'initalizeTradeModule' Function
====================
**parameters:** (index address)
Manually initializes the Trade module. This is normally done by the 'createToken' script.

example invocation:
`node scripts/poc.js initializeTradeModule 0xsetcontractaddress`

'initializeIssuanceModule' Function
========================
**parameters:** (index address)
Manually initializes the BasicIssuance module. This is normally done by the 'createToken' script

example invocation:
`node scripts/poc.js initializeIssuanceModule 0xsetcontractaddress`
