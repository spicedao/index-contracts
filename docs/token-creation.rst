===================================
SET creation, minting and redeeming
===================================
this guide comprises SET creation, minting and redeeming.

preconditions: you should've `set up <./setup.rst>`_ your environment on whatever network you've chosen

.. note:: Please remember the amounts used for this guide are the raw values that the smart contract takes, so if you want to 'mint 1 SCIFI', the amount passed to the mint method should be ``1000000000000000000``

SET creation
============
First of all, you should create a *components file*. This is what defines which tokens will the set represent.

This is a json file with a key ``tokens`` detailing the component's addresses, and a key ``units`` which is how many of the minimal units of the component are required to mint one of the set. For more information on how this works you should refer to `the token composition appendix <./set-composition.rst>`_.

``components.example.mainnet.json`` and ``components.example.kovan.json`` are provided as examples for mainnet and kovan, respectively.

With that out of the way, creating the token should be as simple as calling:

``node scripts/poc.js createToken <symbol> <name> <component file>``

for example:

``node scripts/poc.js createToken ROCKS "awesome token" components.example.mainnet.json``

.. note:: This broadcasts three transactions (creation and initialization of two modules) to the network and might take a while.

.. note:: If the name of the token or any other parameter includes a space, you should use quotes as described above.

After this, you should be able to call ``node scripts/poc.js getTokenInfo <symbol>`` to see the relevant info. For now it's worth paying attention to:

- The units and tokens are those defined in the components file
- Total supply of the set, as well af the set token of all the components are zero.

SET minting
===========
To mint the SET you'll need:

- Balance of all the components. The only case in which this tool can help you is with WETH, where you can use the ``node scripts/poc.js mintWeth <wethAddress> <amount>``. ``wethAddress`` on mainnet should be ``0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2``. If you're using the ``components.example.mainnet.json`` then this should be enough.

- A proper allownace in the components made to the basic issuance module. There's a function for that: ``node scripts/poc.js allowTokens <symbol> <amount>``, which asks the set for its components and then does an allowance of ``<amount>`` automatically.

.. note::

    The allowance is necessary in order for the BasicIssuanceModule to do a transferFrom from the user's address to the set, moving the balances of the components from the user's address to the Set contract.

``node scripts/poc.js getTokenInfo <symbol>`` lists the balances and allowances of all the components, so it should help you check this items.

With those conditions met, ``node scripts/poc.js mintSet <symbol> <amount>`` should mint the set.

If an allowance or balance is insufficient, the mint transaction will fail with with a not-very-helpful ``ERC20 low level call failed``, and you should use ``getTokenInfo`` to see which component(s) are the culprit as described above.

SET redeeming
=============
The only precondition for redeeming the set token for its components is for the caller to have some balance of said set token.

You should be able to do it by executing ``node scripts/poc.js redeemSet <symbol> <amount>``
