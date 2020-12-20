# Index creation

This guide covers index creation.

Preconditions: You should've [set up](./setup.md) your environment on your chosen network.

**Note:** Please remember the amounts used for this guide are the raw values that the smart contract takes, so if you want to 'mint 1 SCIFI', the amount passed to the mint method should be `1000000000000000000`, and not `1`.

Index creation
============
First of all, you should create a *components file*. This is what defines which tokens the index will represent.

This is a json file with a key `tokens` detailing the component's addresses, and a key `units` which is how many of the minimal units of the component are required to mint one of the IndexTokens. For more information on how this works you should refer to [the token composition appendix](./index-composition.md).

`components.example.mainnet.json` and `components.example.kovan.json` are provided as examples for Mainnet and Kovan, respectively.

With that out of the way, creating the token should be as simple as calling:

`node scripts/poc.js createToken <symbol> <name> <component file>`

For example:

`node scripts/poc.js createToken ROCKS "awesome token" components.example.mainnet.json`

**Note:** This broadcasts three transactions (creation and initialization of two modules) to the network and may take a while.

**Note:** If the name of the token or any other parameter includes a space, you should use quotes as described above.

After this, you should be able to call `node scripts/poc.js getTokenInfo <symbol>` to see the relevant info. For now it's worth paying attention to:

- The units and tokens are those defined in the components file
- Total supply of the index, as well as the index token of all the components are zero.

