Basic rebalancing
=================
For this you must be familiar enough with [token minting and redeeming](./minting-and-redeeming.md), and have your [environment set up](./setup.md).

**Note:** Rebalancing is only supported running against a mainnet node, either 'real' (think production environment) or forked.

Once you have an index token and have minted some amount of it, following the guides above. You should be able to do a trade as follows:

`node scripts/poc.js trade <symbol> <source token> <source units> <target token> <min return amount>  <max slippage>`

- Source token: the token whose share of the index you want to decrease
- Source units: how many units (as set in the *components file* ) should be traded for the target token
- Target token: the token that you want to add as a component (or whose share you want to increase)
- Min return amount: how many units of the target token are expected as a minimum return. The trade transaction will revert if the exchange returns less than this.
- Slippage: how much of a price variation can the trade cause before reverting. This will be important with large trasactions, but a default value of 5% will be used if it's omitted

For more info on this method, see [the reference](./reference.md)

**Warning:** It is of **critical importance** for you to research the exchange rates before trading with production assets and set sane min return and slippage values accordingly. It is recommend that you understand the possible consequences of someone front-running a large volume transaction as well.

The amount of *units* to be subtracted/added should be provided, and the script and contracts will take care of converting it to the actual amount of the component token.

After doing the trade, you can call `[node scripts/poc.js getTokenInfo](symbol)` and you should see:
- The units of the source token decrease, or the source token dissappearing from the component list if all of its units were sold
- The units of the target token increase, or the target token being added to the component list if it wasn't present before.

**Note:** When adding a new component to the component list, it is worth noting that users that minted the index before that token was added, will receive said token when redeeming, and less of the source token. A side effect of this is that allowances should be done in the new token in order to mint again.
