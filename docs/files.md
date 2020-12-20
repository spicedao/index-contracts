Files
=====

The scripts reads info from the following files

- `.env`: A .env file which should include `privKey` and `rpcUrl` keys, which are self-explanatory. The `network` key should either be `mainnet` or `kovan`. Additionally you could set the `gasPrice` key if you don't want to use the default one by web3. There is a `.env.example` file which you can copy. It should be placed on the root of the cloned project.
- `sets.json`: Stores the different index tokens created by using this tool. You should only modify this file if you want to create an index with a symbol already defined in the file, or want to manually add a compatible index token created somewhere else (Set v2 compliant). It should be placed on the root of the cloned project.
- `configs/constants.json`: Currently only stores the gas amounts to use for different kinds of transactions. All of them are set to falsy values by default, indicating the scripts to do a gas estimation against the node. You can set the values manually (as strings, for example: `trade: "5000000"`) if you ever run into an out of gas error or something else which can be worked around by a bigger gas value.
- `configs/protocol-contracts.json`: Stores the addresses for the protocol's contracts on every network. You shoud typically leave this alone.
