# Real world rebalancing example


Initial token configuration
===========================

At the time of writing, the top ten ERC20 tokens by market cap are:

token|address                                   |market-cap|price|relative-market-cap|percentage-value    |units    |raw-units
-----|------------------------------------------|----------|-----|-------------------|--------------------|---------|----------------------
USDT |0xdac17f958d2ee523a2206206994597c13d831ec7|19000M    |1    |55.304             |30                  |30.00000 |30000000000000000000
LINK |0x514910771af9ca656af840dff83e8264ecf986ca|5000M     |12   |14.553             |17                  |1.416666 |1416666000000000000
USDC |0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48|3000M     |1    |8.732              |12                  |12.00000 |12000000
WBTC |0x2260fac5e5542a773aa44fbcfedf7c193bc2c599|2000M     |17000|5.821              |9                   |0.000529 |52900
CRO  |0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b|1370M     |0.06 |3.987              |7                   |116.6666 |11666660000
LEO  |0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3|1330M     |1.33 |3.871              |7                   |5.263157 |5263157000000000000
DAI  |0x6b175474e89094c44da98b954eedeac495271d0f|1020M     |1    |2.968              |6                   |6.000000 |6000000000000000000
HT   |0x6f259637dcd74c767781e37bc6133cd6a68aa161|829M      |4    |2.413              |5                   |1.250000 |1250000000000000000
UNI  |0x1f9840a85d5af5bf1d1762f925bdaddc4201f984|806M      |3    |2.346              |5                   |1.666666 |1666666000000000000
SPICE|0xbadf00dbadf00dbadf00dbadf00dbadf00dbadf0|0.42M     |0.01 |0.001              |2                   |200.0000 |200000000000000000000

The 10th token is not set by market cap, as SCIFI will always have 2.5% allocated to SPICE (2% used in this illustration), its governance token.

**Note:** The market cap and prices of the SPICE token are assumed to be stable at those values after trading in public exchanges.

Sum of market caps
34355.42

Units computation
=================

- Subtract 25.3% from USDT, to honor the 30% cap
- Add (25.3/9)% == 2.81 to every other token

Token       |Percentage-value
------------|--------------------
USDT        |30
LINK        |17.363
USDC        |11.542
WBTC        |8.631
CRO         |6.797
LEO         |6.681
DAI         |5.778
HT          |5.223
UNI         |5.156
SPICE       |2.811

- Subtract 0.81 from SPICE so it goes to the target 2%
- Add (0.81/8)% ~= 0.1 to the 8 tokens below the 30% threshold
- Round the values to whole numbers
- Bump the lowest token that wouldn't change the order until the percentages add up to 100 again, or
- Decrease the highest token that wouldn't change the order until the percentages add up to 100 again

Token       |Percentage-value
------------|--------------------
USDT        |30
LINK        |17
USDC        |12
WBTC        |9
CRO         |7
LEO         |7
DAI         |6
HT          |5
UNI         |5
SPICE       |2

Now we know how the index will be configured *by value*, and have to take into consideration the price of each token to compute the actual units.

For that, we divide the percentage of the index a token will have by its price:

Token |Price|Percentage-value|High-level-units
------|-----|----------------|----------------
USDT  |1    |30              |30.00000
LINK  |12   |17              |1.416666
USDC  |1    |12              |12.00000
WBTC  |17000|9               |0.000529
CRO   |0.06 |7               |116.6666
LEO   |1.33 |7               |5.263157
DAI   |1    |6               |6.000000
HT    |4    |5               |1.250000
UNI   |3    |5               |1.666666
SPICE |0.01 |2               |200.0000

And then we should multiply those values by the decimals of each token:

Token |Price|Percentage-value    |Units    |Raw-units
------|-----|--------------------|---------|----------------------
USDT  |1    |30                  |30.00000 |30000000000000000000
LINK  |12   |17                  |1.416666 |1416666000000000000
USDC  |1    |12                  |12.00000 |12000000
WBTC  |17000|9                   |0.000529 |52900
CRO   |0.06 |7                   |116.6666 |11666660000
LEO   |1.33 |7                   |5.263157 |5263157000000000000
DAI   |1    |6                   |6.000000 |6000000000000000000
HT    |4    |5                   |1.250000 |1250000000000000000
UNI   |3    |5                   |1.666666 |1666666000000000000
SPICE |0.01 |2                   |200.0000 |200000000000000000000

Rebalancing
===========

When the prices of tokens change, but the units remain the same, the percentage by value of the token will deviate from the intended distribution.

For example, let's say a few very intense weeks have passed and now the prices and market caps of the different tokens look like this:

Token       |Market-cap|Price
------------|----------|-----
USDT        |14000M    |1    
LINK        |6000M     |12   
USDC        |3000M     |1    
WBTC        |2000M     |14000
CRO         |1370M     |0.06 
LEO         |1330M     |1.33 
DAI         |1920M     |1    
HT          |829M      |3    
UNI         |806M      |3    
SPICE       |3.36M     |0.08 

There are two things to consider:

- The changes in price made the composition of the token change (in value, not in units) from the initial spec.
- The changes in market cap changed what the composition of the tokens (in units) should be, as per the algorithm defined in the paper.

First of all, let's see how the price changes changed composition of the token by value.

For that it's important to define the current percentage by value of a token in the index as `units * marketValue`

Token|Past-value|Current-value
-----|----------|-------------
USDT |30        |30
LINK |17        |17
USDC |12        |12
WBTC |9         |7.4
CRO  |7         |7
LEO  |7         |7
DAI  |6         |6
HT   |5         |3.75
UNI  |5         |5
SPICE|2         |16

However, here we can see the values no longer add up to 100, but to a higher number (in this case 111.1).

This is because the index no longer has the value of U$ 100 initially determined, since the price of its components rose.

Now we have to take into consideration the changes in market cap to see what composition the token should be rebalanced towards:

Token |Market-cap|Price|Market-cap-%|Market-cap-%-corrected
------|----------|-----|------------|----------------------
USDT  |14000M    |1    |44.78801    |30
LINK  |6000M     |12   |19.19486    |21
USDC  |3000M     |1    |9.597432    |11
WBTC  |2000M     |14000|6.398288    |8
CRO   |1370M     |0.06 |4.382827    |6
LEO   |1330M     |1.33 |4.254861    |6
DAI   |1920M     |1    |6.142356    |8
HT    |829M      |3    |2.652090    |4
UNI   |806M      |3    |2.578510    |4
SPICE |3.36M     |0.08 |0.010749    |2

The sum of market caps: `31258.36`

This implies the token should have that composition by percentage, however this will not translate directly to composition in U$ dividing by the price, as now said magnitude shouldn't add up to 100, but to 111.1

The proper definiton of U$ value by component would be:

.. math::

    newUnit = \frac{correctedPercentage*\frac{newIndexLevel}{oldIndexLevel}}{currentPrice}

That value is then divided by the price to obtain the units:

Token|Value-in-U$-per-index-unit|Price|Units
-----|--------------------------|-----|------------
USDT |33.330                    |1    |33.330000000
LINK |23.331                    |12   |1.9442500000
USDC |12.221                    |1    |12.221000000
WBTC |8.888                     |14000|0.0006348571
CRO  |6.666                     |0.06 |111.10000000
LEO  |6.666                     |1.33 |5.0120300751
DAI  |8.888                     |1    |8.8880000000
HT   |4.444                     |3    |1.4813333333
UNI  |4.444                     |3    |1.4813333333
SPICE|2.222                     |0.08 |27.775000000

To wrap this point up, let's see the difference in units, what they're now vs what they should be:

Token |Units-current|Units-target
------|-------------|----------------------
USDT  |30.00000     |33.330000000
LINK  |1.416666     |1.9442500000
USDC  |12.00000     |12.221000000
WBTC  |0.000529     |0.0006348571
CRO   |116.6666     |111.10000000
LEO   |5.263157     |5.0120300751
DAI   |6.000000     |8.8880000000
HT    |1.250000     |1.4813333333
UNI   |1.666666     |1.4813333333
SPICE |200.0000     |27.775000000

And now, compute the amount to be traded (in USD) for each unit of the index token, defined as:

.. math::

    tradeAmount = (unitsCurrent-unitsTarget)*price

Positive ones should be `sourceAmount` parameters and negative ones `minReturn`

Token |U$-amount-to-trade
------|------------------
USDT  |-3.330000000
LINK  |-6.3310080000
USDC  |-.221000000
WBTC  |-1.4819994000
CRO   |.3339960000
LEO   |.333998810117
DAI   |-2.8880000000
HT    |-.6939999999
UNI   |.5559980001
SPICE |13.77800000000

This amounts should always add up to zero, sans rounding errors, since trading should always be zero-sum.

It's also worth noting that some value will be lost doing the rebalance to price slippage and exchange fees, so it might not be possible to get exactly the target units, and due to said fees it'd be harmful to try to get it too close. The worst case scenario would be having a script do trades until the difference between the target and current units is zero, so if this is automated special care would have to be taken.

Rebalancing operations
======================

The proposed rebalancing algorithm is as follows:

- Divide the token list in those with a negative or a positive amount to trade

Token |U$-amount-to-trade
------|------------------
CRO   |.3339960000
LEO   |.333998810117
UNI   |.5559980001
SPICE |13.77800000000

Token |U$-amount-to-trade
------|------------------
USDT  |-3.330000000
LINK  |-6.3310080000
USDC  |-.221000000
WBTC  |-1.4819994000
DAI   |-2.8880000000
HT    |-.6939999999

- Sort both lists so the biggest value rebalances are at the top

Token |U$-amount-to-trade
------|------------------
SPICE |13.77800000000
UNI   |.5559980001
LEO   |.333998810117
CRO   |.3339960000

Token |U$-amount-to-trade
------|------------------
LINK  |-6.3310080000
USDT  |-3.330000000
DAI   |-2.8880000000
WBTC  |-1.4819994000
HT    |-.6939999999
USDC  |-.221000000

- Pick the top entries from both lists
- Choose the minimum absolute value of the two as the amount to trade

Source-token|U$-amount-to-send|Target-token|U$-amount-to-receive
------------|-----------------|------------|--------------------
SPICE       |6.3310080000     |LINK        |-6.3310080000

- If the amount to trade is higher than a preset threshold (U$1 per index unit with this example), continue with the next step. Otherwise, rebalance can be consider finished.

- Prepare to execute the trade. For this we'll need
    - To convert both values to their units, from the amount in U$ described above: `79.13760000000000000000 SPICE, 75.9720960000 LINK`
    - To convert the units value to the *raw* units, using the token's decimals: `79137600000000000000 SPICE, 527584000000000000 LINK`
    - To compute the minReturn amount taking into consideration the acceptable slippage (5% in this example): `501204800000000000 LINK`

- Execute the trade: `node scripts/poc.js SYMBOL spiceAddress 79137600000000000000 linkAddress 501204800000000000 5`

- With the values returned from the trade (**not** the parameters sent to it, since the transaction might have executed with a lower slippage than the worst-case 5%), update and re-sort the tables. For this example we assume a slippage of 2%.

Token |U$-amount-to-trade
------|------------------
SPICE |7.44699200000
UNI   |.5559980001
LEO   |.333998810117
CRO   |.3339960000

Token |U$-amount-to-trade
------|------------------
USDT  |-3.330000000
DAI   |-2.8880000000
WBTC  |-1.4819994000
HT    |-.6939999999
USDC  |-.221000000
LINK  |-.126620160000

.. TODO
.. also, the value distribution and units should now look like:

- Go back to picking the tokens with the most volume to trade:

Source-token|U$-amount-to-send|Target-token|U$-amount-to-receive
------------|-----------------|------------|--------------------
SPICE       |3.330000000      |USDT        |3.330000000

- Prepare to execute the trade:
    - High-level units: `41.62500000000000000000 SPICE, 3.33 USDT`
    - Raw units: `41625000000000000000 SPICE, 3330000 USDT`
    - minReturn, with 5% slippage: `3163500 USDT`

- Execute the trade: `node scripts/poc.js SYMBOL spiceAddress 41625000000000000000 usdtAddress 3163500 5`

- Update the tables (assuming slippage of 2%)

Token |U$-amount-to-trade
------|------------------
SPICE |4.11699200000
UNI   |.5559980001
LEO   |.333998810117
CRO   |.3339960000

Token |U$-amount-to-trade
------|------------------
DAI   |-2.8880000000
WBTC  |-1.4819994000
HT    |-.6939999999
USDC  |-.221000000
LINK  |-.126620160000
USDT  |-.06660000000

- Go back to picking the tokens with the most volume to trade:

Source-token|U$-amount-to-send|Target-token|U$-amount-to-receive
------------|-----------------|------------|--------------------
SPICE       |2.8880000000     | DAI        |-2.8880000000

- Prepare to execute the trade:
    - High-level units value: `36.10000000000000000000 SPICE, 2.888 DAI`
    - Raw units: `36100000000000000000 SPICE, 2880000 DAI`
    - minReturn, with 5% slippage: `2736000 DAI`

- Execute the trade: `node scripts/poc.js SYMBOL spiceAddress 36100000000000000000 daiAddress 2736000 5`

- Update the tables. Only for the purposes of highlighting a possible scenario, let's assume a negative slippage of -3% (for the case where the trade executes at a rate better than expected)

Token |U$-amount-to-trade
------|------------------
SPICE |1.228992000000
UNI   |.5559980001
LEO   |.333998810117
CRO   |.3339960000
DAI   |.08664

Token |U$-amount-to-trade
------|------------------
WBTC  |-1.4819994000
HT    |-.6939999999
USDC  |-.221000000
LINK  |-.126620160000
USDT  |-.06660000000

This is pretty inocuous, but it showcases that a token moved from the 'get more of' to the 'get rid of' list

- Go back to picking the tokens with the most volume to trade:

Source-token|U$-amount-to-send|Target-token|U$-amount-to-receive
------------|-----------------|------------|--------------------
SPICE       |1.228992000000   |WBTC        |1.228992000000

- Prepare to execute the trade:
    - High-level units: `15.36240000000000000000 SPICE, .00008778514285714285 WBTC`
    - Raw units: `15362400000000000000 SPICE, 8778 WBTC`
    - minReturn, with 5% slippage: `8339 WBTC`

- Execute the trade: `node scripts/poc.js SYMBOL spiceAddress 15362400000000000000 wbtcAddress 8339 5`

- Update the tables (assuming slippage of 2%)

Token |U$-amount-to-trade
------|------------------
UNI   |.5559980001
LEO   |.333998810117
CRO   |.3339960000
DAI   |.08664
SPICE |0

Token |U$-amount-to-trade
------|------------------
HT    |-.6939999999
USDC  |-.221000000
LINK  |-.126620160000
USDT  |-.06660000000
WBTC  |-.029639988000

- Go back to picking the tokens with the most volume to trade:

Source-token|U$-amount-to-send|Target-token|U$-amount-to-receive
------------|-----------------|------------|--------------------
UNI         |.5559980001      |HT          |.6939999999

But now the amount to trade per index unit is below our threshold, so we consider rebalancing finished.

Wrapping up, we sold:



    79137600000000000000 + 41625000000000000000 + 36100000000000000000 + 15362400000000000000  == 172225000000000000000 SPICE

and bought:



    527584000000000000 LINK
    3330000 USDT
    2880000 DAI
    8778 WBTC

So the token's raw units changed as following:

Token       |Original-raw-units   |New-raw-units
------------|---------------------|----------------------
USDT        |30000000000000000000 |30000000000003330000
LINK        |1416666000000000000  |1944250000000000000
USDC        |12000000             |12000000
WBTC        |52900                |61678
CRO         |11666660000          |11666660000
LEO         |5263157000000000000  |5263157000000000000
DAI         |6000000000000000000  |6000000000002880000
HT          |1250000000000000000  |1250000000000000000
UNI         |1666666000000000000  |1666666000000000000
SPICE       |200000000000000000000|27775000000000000000
