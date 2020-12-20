SCIFI POC
=========

What we've done so far is reproducible with the help of the file `scripts/poc.js`

This is set up as a node.js project, you should use node version: 12.16.3 (although any 12 version should work) and run `npm install` before using any of the functionality described below.

If you don't have node installed, or have a major version other than 12, then the recommended approach is to use [nvm](https://github.com/nvm-sh/nvm)

Configuration files
===================

See [the relevant document](./files.md)

Commands
========

This repo provides a script which can execute several functions, usually called like so:

`node scripts/poc.js <function name> <ticker symbol> ...<extra arguments>`

For a detailed explaination of each one, see [the relevant document](./reference.md)

Guides
======

- [Getting started and setting up the environment](./setup.md)
- [Creating a token](./index-creation.md)
- [Minting](./minting.md)
- [Redeeming](./redeeming.md)
- [Doing your first rebalancing](./basic-rebalancing.md)
- [A real-world rebalancing example](./real-world-rebalancing.md)

Appendixes
==========
- [How is the index composition computed](./index-composition.md)
- [Running tests](./test.md)
