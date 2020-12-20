Index minting
===========
To mint the IndexToken you'll need:

- You should've already [created an index](./index-creation.md) your environment on your chosen network.

- Balance of all the components. The only case in which this tool can help you is with WETH, where you can use the `node scripts/poc.js mintWeth <wethAddress> <amount>`. `wethAddress` on mainnet should be `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`. If you're using the `components.example.mainnet.json` then this should be enough.

- A proper allowance in the components made to the basic issuance module. There's a function for that: `node scripts/poc.js allowTokens <symbol> <amount>`, which asks the index for its components and then does an allowance of `<amount>` automatically.

**Note:** The allowance is necessary in order for the BasicIssuanceModule to do a transferFrom from the user's address to the index, moving the balances of the components from the user's address to the index contract.

`node scripts/poc.js getTokenInfo <symbol>` lists the balances and allowances of all the components, so it should help you check this items.

With those conditions met, `node scripts/poc.js mintSet <symbol> <amount>` will mint the index.

If an allowance or balance is insufficient, the 'mint' transaction will fail with with a not-very-helpful `ERC20 low level call failed`, and you should use `getTokenInfo` to see which component(s) are the culprit as described in the [previous document](./index-creation.md).

