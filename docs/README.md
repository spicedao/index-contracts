Index Contracts
===============

This repository contains the contracts and interaction scripts for index deployment on the SPICE DAO.
The index is based on [Set Protocol](https://github.com/SetProtocol/set-protocol-v2-contracts) and is extended for our purposes with the controller script.

Deployed Index Contracts
========================

So far, two live index products have been deployed for the SPICE DAO on the Ethereum main net.

 Index Name | Index Website | Contract Address 
------------|---------------|------------------
SCIFI      | [SCIFI Website](https://scifi.finance/scifi) | [0xfdc4a3fc36df16a78edcaf1b837d3acaaedb2cb4](https://etherscan.io/token/0xfdc4a3fc36df16a78edcaf1b837d3acaaedb2cb4)
GBI | [GBI Website](https://scifi.finance/galacticblueindex) | [0xcb67be5c54eab9462967ee3c03c35bfffeb801cd](https://etherscan.io/token/0xcb67be5c54eab9462967ee3c03c35bfffeb801cd)

Script Setup
============

The scripts in this repository are intended for the Set manager to control the index contracts.
Everything is reproducible with the help of the file `scripts/poc.js`

This is set up as a node.js project, you should use node version: 12.16.3 (although any 12 version should work) and run `npm install` before using any of the functionality described below.

If you don't have node installed, or have a major version other than 12, then the recommended approach is to use [nvm](https://github.com/nvm-sh/nvm)

Configuration files
===================

See [the relevant document](https://github.com/spicedao/index-contracts/tree/master/docs/files.md)

Commands
========

This repo provides a script which can execute several functions, usually called like so:

`node scripts/poc.js <function name> <ticker symbol> ...<extra arguments>`

For a detailed explaination of each one, see [the relevant document](https://github.com/spicedao/index-contracts/tree/master/docs/reference.md)

Guides
======

- [Getting started and setting up the environment](https://github.com/spicedao/index-contracts/tree/master/docs/setup.md)
- [Creating a token](https://github.com/spicedao/index-contracts/tree/master/docs/index-creation.md)
- [Minting](https://github.com/spicedao/index-contracts/tree/master/docs/minting.md)
- [Redeeming](https://github.com/spicedao/index-contracts/tree/master/docs/redeeming.md)
- [Doing your first rebalancing](https://github.com/spicedao/index-contracts/tree/master/docs/basic-rebalancing.md)
- [A real-world rebalancing example](https://github.com/spicedao/index-contracts/tree/master/docs/real-world-rebalancing.md)

Appendixes
==========
- [How is the index composition computed](https://github.com/spicedao/index-contracts/tree/master/docs/index-composition.md)
- [Running tests](https://github.com/spicedao/index-contracts/tree/master/docs/test.md)
