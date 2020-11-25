======================
High-level functions
======================

Functions in the script file can be invoked in the command line via
'high level' functions are those that operate on one of the SET tokens defined in ``sets.json``. And ``createToken``, which adds a new one

``node scripts/poc.js functionName SYMBOL [...other args]``

createToken
============
parameters: symbol, name, componentsFile

``node scripts/poc.js createToken SCIFI "scifi token" components.json``

Creates a Set Token calling the ContractCreator, and initializes the Trade and BasicIssuance modules.
The components file should be a JSON file with ``tokens`` and ``units`` keys defining the token composition. Examples for mainnet (``components.example.mainnet.json``) and kovan (``components.example.kovan.json``) are provided. Broadcasts a total of three transactions

Updates the ``sets.json`` file with the token's address.

Technically (as in: in the codebase) it's a low-level function. But this should only matter if you're trying to extend the scripts.

getTokenInfo
============
parameters: symbol

example invocation:
``node scripts/poc.js getTokenInfo SCIFI``

logs, in the following order:
- token address, name and symbol
- module list
- positions (list of tokens and units)
- Set balance of address in use
- balance, allowance of each ERC20 component, as reported by the Set

trade
=====
parameters: symbol, sourceToken, sourceUnits, targetToken, minTargetUnits
optional parameters: slippage=5

.. note::

    this only works on mainnet, if you want to perform tests you'll have to run a `forked mainnet node <./setup.rst>`_

Trades a component for another token.
The later can already be a component or be a new token to add to the component list. Additionally, it's possible to sell all of a token's units and effectively remove it from the component list

The amount of _units_ to be subtracted/added should be provided, and the script and contracts will take care of converting it to the actual amount of the component token.

- source token: the token whose share of the set you want to decrease
- source units: how many units (as set in the *components file* ) should be traded for the target token
- target token: the token that you want to add as a component (or whose share you want to increase)
- min return amount: how many units of the target token are expected as a minimum return. The trade transaction will revert if the exchange returns less than this.
- slippage: how much of a price variation can the trade cause before reverting. This will be important with large trasactions, but a default value of 5% will be used if it's omitted

The amount of *units* to be subtracted/added should be provided, and the script and contracts will take care of converting it to the actual amount of the component token.

.. warning::

    it's of **critical importance** for you to research the exchange rates before trading with production assets and set sane min return and slippage values accordingly. You should probably think about the possible consecuences of someone front-running a large volume transaction as well.

Ideally you should set the slippage so it matches with the min return amount.
For example if you want to trade 100 units of token A which is currently equivalent to 100 units of token B, but such a big transaction is expected to sway the price by 7%, you should (giving some extra margin) call:

.. code:: 

    node scripts/poc.js trade tokenAaddress  100 tokenBAddress 92 8

However, if a better price is available, the transaction will execute at that price. The minReturn parameter is only a protection against front-running or unexpected changes in price.

Possible errors
---------------
The most usual error with this method is a transaction revert with the error ``min amount quantity mismatch``, which is caused by the exchange returning less than ``min return amount``. You can walk around it by lowering this amount.

A little example
----------------

For example, if we had a token that maps 1:1 to WETH:

.. code::

    components: [wethAddress]
    units: [10**18]

and wanted to trade 50% of the locked weth for another token, valued at 2 eth, we should invoke

.. code::

    node scripts/poc.js trade wethAddress 5*10**17 otherTokenAddress 2.49*10**17

leaving some room for slippage

Be mindful that the tool doesn't parse the math expressions, so a typical invocation looks like this:

.. code::

    node scripts/poc.js trade 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2  11247276025800 0x2b591e99afe9f32eaa6214f7b7629768c40eeb39 58000000

.. warning::

    This method calls 1inch's API to generate the calldata to properly route the exchange. If we wanted to run the trade in a trust-minimized way we should further improve the scripts to compute this calldata ourselves

allowTokens
===========
parameters: symbol
optional parameters: amount=10

example invocation:
``node scripts/poc.js allowTokens SCIFI``

Sets an allowance for all of the set's components

.. note:: this broadcasts as many transactions as the set has components, and might take a while

mintSet
=======
parameters: symbol
optional parameters: amount=0.01

example invocation:
``node scripts/poc.js mintSet SCIFI 10000000000000000000``

mints the provided amount Set tokens

redeemSet
=========
parameters: symbol
optional parameters: amount
preconditions: some amount of tokens have been minted

example invocation:
``node scripts/poc.js redeemSet SCIFI 5000000000000000000``

redeems the provided amount of the address' Set balance.  
redeems the entire balance if an amount isn't provided

===================
Low-level functions
===================
These perform individual actions, don't directly use the already defined SETs, and don't take a token's symbol as a first parameter.

mintWeth
========
parameters: (weth token address)
optional parameters: amount=0.01

example invocation:
``node scripts/poc.js mintWeth 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 100000000000000000``

mints the provided amount of WETH

initalizeTradeModule
====================
parameters: (set address)
Manually initializes the Trade module. This is normally done by the createToken script

example invocation:
``node scripts/poc.js initializeTradeModule 0xsetcontractaddress``

initializeIssuanceModule
========================
parameters: (set address)
Manually initializes the BasicIssuance module. This is normally done by the createToken script

example invocation:
``node scripts/poc.js initializeIssuanceModule 0xsetcontractaddress``
