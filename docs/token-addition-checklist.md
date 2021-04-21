# Token addition checklist
This list tries to list what checks we should perform on a token before adding it to an Index (either at creation time or via a rebalance)

Upgradeability
--------------
Upgradeability via a Proxy pattern is a hard no, unless it's already properly disabled (eg: the contract is updated by its Owner, and the Owner was already set to address 0)

Other upgradeability options (eg: delegating the minting cap or other parameter to a secondary, changeable contract) are okay **as long as they don't interfere with the `transferFrom`, `transfer` or `approve` methods** 

Balance changes outside of transfers
------------------------------------
The token MUST NOT decrease holders' balances unless in an action initiated by the holder or an approved spender. This could lead to the Index being undercollateralized.

Transfer or TransferFrom modifications
--------------------------------------
Basically the transferFrom or transfer methods must:
- Increase the receiver's balance by **exactly** the amount that is subtracted from the sender
- Always transfer tokens if the balance and allowance (if applicable) is sufficient, without checking anything else that isn't set by the token holder. (Although baked-in blacklists, which are set at contract deploy time and are not modifiable by anyone could be okay)
- IF they DO return a value, the value MUST be `true` when the transfer suceeds.

Common offenders are:
- Address blacklisting:  They're a hard no. It'd give the component's admin the ability to lock the Set contract.
- Transfer fees: They're a hard no as well. This could eventually be walked around if forking Set protocol
- Timelocks (although they could be non-problematic. Every case should be reviewed separately)
- Pausing that inhibits transfering

Approve modifications
---------------------
It's important it doesn't have caps (either soft, silent ones or ones that revert) or blacklisting, otherwise rebalances might not be possible.

In the case a token has max allowance value of `uint96`, for example, special care should be taken  to be sure that we remain able to rebalance the token away given its decimals (if, say, 100x the max allowance value could be locked in the Index, we'd have to execute 100 trades to rebalance it away, and that could be problematic)

If the token implements approval race protections (not allowing approve of an amount M > 0 when an existing amount N > 0 is already approved), we should check that the rebalancing module **always** transfers as many tokens as it approves, otherwise it might not be possible to rebalance it away.

Weird decimals
--------------
If the token has less than 18 decimals, it shouldn't be an issue, however, tokens with more than 18 decimals will limit the amount of the Index that can be minted, and we should check that it remains at acceptable levels

ERC20 deviations we _don't_ care about
---------------------------------------------
- IF `transferFrom` or `transfer` methods DO NOT return a value, we don't care if the transfer doesn't revert if it fails, since the balance is checked independently (`transferFrom` in `ExplicitERC20.sol`)
- We don't care if the token fails on a zero-value transfer, since mints/redeems of that amount don't make any sense and rebalance will fail before attempting to transfer a value of zero. (`_validatePreTradeData`)
    - `payProtocolFeeFromSetToken` doesn't do transfers of zero
- We don't care if the token fails on a transfer to the null address, since the system never burns tokens that way.
    - it doesn't make sense to call `payProtocolFeeFromSetToken` if the fee recipient is the null address. (other than to have the total supply of the token more closely match the circulating supply, but it doesn't make a difference)
- Anything related to events.
- redeem and mint have reentracy guards, so malicious tokens couldn't exploit reentrancy attacks in this operations. Reentrancy attacks on exchange trades have not been researched, though.
