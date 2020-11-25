=====
Files
=====

The scripts reads info from the following files

- ``.env``: a .env file which should include ``privKey`` and ``rpcUrl`` keys, which are self-explanatory. The ``network`` key should either be ``mainnet`` or ``kovan``. Additionally you could set the ``gasPrice`` key if you don't want to use the default one by web3. there's a ``.env.example`` file which you can copy. It should be placed on the root of the cloned project.
- ``sets.json``: stores the different Sets created by using this tool. You should only modify it if you want to create a set with a symbol already defined in the file, or want to manually add a set created somewhere else. It should be placed on the root of the cloned project.
- ``configs/constants.json``: currently only stores the gas amounts to use for different kinds of transactions. You should only modify it if you want to set a higher gas value to walk around a 'out of gas' error.
- ``configs/protocol-contracts.json``: stores the addresses for the protocol's contracts on every network. You shoudn't tipically have to change anything here.
