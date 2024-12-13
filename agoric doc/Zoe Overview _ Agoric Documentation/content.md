

Zoe Overview [​](#zoe-overview)
===============================

The Zoe service and smart contract API support credibly trading assets with reduced risk.

* **Zoe is Safer for Users:** Zoe guarantees that when you make an offer, you get either what you said you wanted or a full refund of the assets you put in, even if the contract is buggy or malicious.
* **Zoe is Safer for Developers**: For a given offer, if you make a mistake with the amount of assets you take or give, Zoe guarantees that your users will either get what they say they wanted or get a refund.

High Level Trading Flow [​](#high-level-trading-flow)
-----------------------------------------------------

Trading with a contract using Zoe typically goes through these steps:

![offer safety flow with contracts, zoe, and parties](/assets/offer-safety-flow.DqbqgPTd.svg)

1. Parties call [E(zoe).offer(invitation, proposal, assets)](/reference/zoe-api/zoe.html#e-zoe-offer-invitation-proposal-paymentpkeywordrecord-offerargs). Zoe escrows the assets.
2. Zoe relays the proposal to the contract identified in the invitation.
3. The contract handles proposals using its custom business logic.
4. The contract instructs Zoe to [reallocate](/reference/zoe-api/zoe-contract-facet.html#zcf-reallocate-seats) assets among the parties.
5. The contract completes (aka [exits](/reference/zoe-api/zcfseat.html#azcfseat-exit-completion)) the offers.
6. Zoe pays out assets to the parties.

Note that in this flow, *assets are not sent to the contract*; only information about them. *For more on this distinction, see [The Settlers of Blockchain](https://agoric.com/blog/technology/the-settlers-of-blockchain) Jun 2021.*

Watch: Offer Safety: Partitioning Risk in Smart Contracts (20 min. Sep 2019)

Building and Using Contracts [​](#building-and-using-contracts)
---------------------------------------------------------------

* [Zoe Smart Contract Basics](./contract-basics.html)
* [A Complete Contract Walk-Through: offer-up](./contract-walkthru.html)

Live Coding and Example Contracts [​](#live-coding-and-example-contracts)
-------------------------------------------------------------------------

Watch: How To Build a Composable DeFi Contract (1:47 Dec 2020)

Agoric has written [a number of example contracts that you can use](./contracts/index.html), including:

* an [Automated Market Maker (AMM) implementation](./contracts/constantProductAMM.html)
* a [covered call option contract](./contracts/covered-call.html)
* an [OTC Desk market maker contract](./contracts/otc-desk.html)
* contracts for [minting fungible](./contracts/mint-payments.html) and [non-fungible tokens](./contracts/mint-and-sell-nfts.html)

Beta Features

These contracts may depend on features from our Beta release that are not available in mainnet.

