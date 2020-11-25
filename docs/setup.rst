=====
setup
=====

There are three main ways to use this scripts:

- Against the Kovan testnet: easy to set-up, but since 1inch isn't deployed there, rebalancing isn't supported
- Against Mainnet: meant for production deployments, with real tokens and real money involved
- Against a forked Mainnet node: for testing (both manual and automated) which requires using the Trading functionality.

In any case, you should provide private keys as the ``privkey`` key on the ``.env`` file.

Against the Kovan testnet
=========================
You'll need

- A regular Kovan node (If you don't have one of those lying around, you can use alchemyapi.io or infura)
- An address with some kovan ETH

then, in the ``.env`` file:

- set the privkey as described above
- set the ``rpcUrl`` to your node's address
- set ``network`` to ``kovan``

Against Mainnet
===============
You'll need

- A regular Mainnet node (If you don't have one of those lying around, you can use alchemyapi.io or infura)
- An address with some real ETH

then, in the ``.env`` file:

- set the privkey as described at the top of this document
- set the ``rpcUrl`` to your node's address
- set ``network`` to ``mainnet``

Against a forked Mainnet node
=============================
1Inch swap isn't available on Kovan, so to demo the trade functionality we need a forked mainnet node

You'll need

- An archive Mainnet node (If you don't have one of those lying around, you can use alchemyapi.io)
- ``ganache-cli`` installed globally ``npm i -g ganache-cli``

Run the forked node like so:

.. code:: 

    ganache-cli --fork <mainnet_node_url> --account <your_privkey>,99999999999999999999999999999999999

.. note::

    The ``--account`` flags sets your address' balance to be a very high number so you can mint WETH and pay gas fees. You don't actually need to have funds in the address associated to that privkey.

If the node starts correctly, you should have ganache listening on port 8545

then, in the ``.env`` file, you'll need to set your privatekey as described at the top of this document and:

- set the `rpcUrl` to `http://localhost:8545` (where the forked node is listening) 
- set ``network`` to ``mainnet``
