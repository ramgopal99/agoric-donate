

OTC Desk Contract [​](#otc-desk-contract)
=========================================

 Zoe v0.24.0. Last updated August 25, 2022. 
##### [View the code on Github](https://github.com/Agoric/agoric-sdk/blob/4e0aece631d8310c7ab8ef3f46fad8981f64d208/packages/zoe/src/contracts/otcDesk.js) (Last updated: Mar 1, 2022) [​](#view-the-code-on-github-last-updated-mar-1-2022)

##### [View all contracts on Github](https://github.com/Agoric/agoric-sdk/tree/master/packages/zoe/src/contracts) [​](#view-all-contracts-on-github)

![Building a Composable DeFi Contract](/assets/title.B2XGVIAX.jpg)

This is the OTC Desk contract from the "Building a Composable DeFi Contract" episode of [Cosmos Code With Us workshop](https://www.youtube.com/watch?v=e9dMkC2oFh8).

[Watch the replay of the workshop](https://www.youtube.com/watch?v=faxrecQgEio): [![Building a Composable DeFi Contract](/assets/play.Cwea0HVO.png)](https://www.youtube.com/watch?v=faxrecQgEio)

Functionality [​](#functionality)
---------------------------------

The OTC Desk contract is based on an idea by Haseeb Qureshi in ["Unbundling Uniswap: The Future of On-Chain Market Making"](https://medium.com/dragonfly-research/unbundling-uniswap-the-future-of-on-chain-market-making-1c7d6948d570)

![OTC Desk](/assets/contract.C3G9JgUe.svg)

In this OTC Desk Contract:

* Trades are atomic and “trustless”
* Creator keeps all profits
* Can use any pricing mechanism
* Can stop quoting when the market is crazy
* Can trade fungible and non-fungible digital assets
* Uses another contract (the [covered call option contract](https://github.com/Agoric/agoric-sdk/blob/HEAD/packages/zoe/src/contracts/coveredCall.js)) as a reusable component

The Dapp [​](#the-dapp)
-----------------------

This contract is also available as a [dapp with deploy scripts](https://github.com/Agoric/dapp-otc).

