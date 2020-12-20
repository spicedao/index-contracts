# Index composition

All index tokens have 18 decimals. The minimal units will be called that, 'minimal units' and the amounts as would be displayed in a user facing application will be referred to as 'human-readable units'

When creating a token, you must pass two arrays of the token's addresses and their *units*

For each token, the corresponding *unit* is how many *minimal units* of it are required in order to mint 1 *human-readable unit* of the index.

Example: only one component
===========================

An index which only has one component, WETH. WETH has 18 decimals, so if we want our index to match 1:1 with WETH, we should set:

    tokens: [wethAddress]
    units: [10**18]

If we want instead for every index to be worth 4 WETH, then we would set:

    tokens: [wethAddress]
    units: [4*10**18]

Example: two components
=======================

An index with two components, let's say WETH and DAI (both with 18 decimals), can require any amount of the two tokens. For example, if we want an index to be worth 1 WETH and 1 DAI, we would set:

    tokens: [wethAddress, daiAddress]
    units: [10**18, 10**18]

This, however, only means that a user wanting to mint 1 IndexToken would need to have 1 WETH and 1 DAI. *It does not mean the token is 50% WETH and 50% DAI by value in USD*. The index contracts aren't aware of the price of their underlying components.

If we wanted to achieve that, we would need to configure the index in a similar fashion to:

    tokens: [wethAddress, daiAddress]
    units: [10**18, 400* 10**18]

And each 'human-readable unit' of the token would be worth around U$800. If we wanted the token to be worth, say, $10, and be composed 50% WETH and 50% DAI *by usd value*, then both `units` should be scaled down by the same factor

    tokens: [wethAddress, daiAddress]
    units: [(5/400)*10**18, 5*10**18]

**Note:** Since index tokens are ERC20 tokens themselves, there's nothing stopping an index from being used as a component in another index.
