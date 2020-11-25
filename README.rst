=======
SCIFI POC
=======

What we've done so far is reproducible with the help of the file ``scripts/poc.js``

This is set up as a node.js project, you should use node version: 12.16.3 (although any 12 version should work) and run ``npm install`` before using any of the functionality described below.

If you don't have node installed, or have a major version other than 12, then the reccommended approach is to use `nvm <https://github.com/nvm-sh/nvm>`_

configuration files
===================

see `the relevant document <./docs/files.rst>`_

commands
========

This repo provides a script which can execute several functions, usually called like so:

``node scripts/poc.js <function name> <ticker symbol> ...<extra arguments>``

For a detailed explaination of each one, see `the relevant document <./docs/reference.rst>`_

guides
======

- `getting started and setting up the environment <./docs/setup.rst>`_
- `creating a token <./docs/token-creation.rst>`_
- `doing your first rebalancing <./docs/basic-rebalancing.rst>`_
- `a real-world rebalancing example <./docs/real-world-rebalancing.rst>`_

appendixes
==========
- `how is set composition computed <docs/set-composition.rst>`_
- `runing tests <docs/tests.rst>`_
