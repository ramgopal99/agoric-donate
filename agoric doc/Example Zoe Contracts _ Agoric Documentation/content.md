

Example Zoe Contracts [​](#example-zoe-contracts)
=================================================

 Zoe v0.24.0. Last updated August 25, 2022. 

While Zoe provides the means to build custom smart contracts, there is a good chance you will want to use one that follows a commonly-used structure. Therefore, we currently provide several pre-built example contracts that can be imported and run on Zoe. Note that none of the contracts described below are automatically deployed on-chain.

Oracle Contracts [​](#oracle-contracts)
---------------------------------------

| Contract | Description |
| --- | --- |
| [Oracle Query](./oracle.html) | A low-level oracle contract for querying [Chainlink](https://docs.chain.link/docs/request-and-receive-data#config) or other oracles. |
| [PriceAuthority](/guides/zoe/price-authority.html) | To use an price oracle in your own contract, we recommend using the `priceAuthority` higher-level abstraction. |

DeFi Contracts [​](#defi-contracts)
-----------------------------------

These contracts create various sorts of financial instruments.

| Contract | Description |
| --- | --- |
| [Vault](./vault.html) | The Vault is the primary mechanism for making IST (the Agoric stable-value currency) available to participants in the economy. It does this by issuing loans against supported types of collateral. The creator of the contract can add new types of collateral. (This is expected to be under the control of on-chain governance after the initial currencies are defined when the contract starts up.) |
| [Loan](./loan.html) | A basic collateralized loan contract. |
| [Funded Call Spread](./fundedCallSpread.html) | Creates a pair of fully collateralized call spread options. They are ERTP assets and can be used as such in other contracts. This contract has two variants, which affect how invitations are created. This version is fully funded by the creator, who receives a matching pair of call spread options. They can be traded or sold separately. |
| [Priced Call Spread](./pricedCallSpread.html) | Creates a pair of fully collateralized call spread options. They are ERTP assets and can be used as such in other contracts. This contract has two variants, which affect how invitations are created. In this version, the creator requests a pair of invitations. Each one lets the holder obtain one of the positions by providing a started portion of the collateral. This version is useful for a market maker who finds pairs of participants with matching interests. |
| [Covered Call](./covered-call.html) | Creates a call option, which is the right to buy an underlying asset. |
| [OTC Desk](./otc-desk.html) | A contract for giving quotes that can be exercised. The quotes are guaranteed to be exercisable because they are actually options with escrowed underlying assets. |

AMM (Automatic Market Maker) Contract [​](#amm-automatic-market-maker-contract)
-------------------------------------------------------------------------------

| Contract | Description |
| --- | --- |
| [ConstantProduct AMM](./constantProductAMM.html) | An automated market maker with multiple liquidity pools that can trade between any pair of funded currencies. It charges a poolFee (added to the liquidity pools) and a protocolFee (set aside for the benefit of the Agoric economy). These fees are subject to change by votes controlled by and made visible by the governance system. |

Generic Sales/Trading Contracts [​](#generic-sales-trading-contracts)
---------------------------------------------------------------------

These contracts involve trading or selling ERTP digital assets.

| Contract | Description |
| --- | --- |
| [Sell Items](./sell-items.html) | A generic sales contract, mostly used for selling NFTs for money. |
| [Atomic Swap](./atomic-swap.html) | A basic trade of digital assets between two parties. |
| [Barter Exchange](./barter-exchange.html) | An exchange with an order book letting all kinds of goods to be offered for explicit barter swaps. |
| [Second-Price Auction](./second-price-auction.html) | An auction in which the highest bidder wins and pays the second-highest bid. This version doesn't conceal the bids (an essential aspect of second price auctions). Therefore, **it should not be used in production**. |
| [Simple Exchange](./simple-exchange.html) | A basic exchange with an order book for one asset, priced in a second asset. |

Governance Contract [​](#governance-contract)
---------------------------------------------

| Contract | Description |
| --- | --- |
| [Escrow To Vote](./escrow-to-vote.html) | A coin voting contract in which votes are weighted by the escrowed governance tokens. |

Minting Contracts [​](#minting-contracts)
-----------------------------------------

| Contract | Description |
| --- | --- |
| [Mint Payments](./mint-payments.html) | An example of minting fungible tokens. |
| [Mint and Sell NFTs](./mint-and-sell-nfts.html) | A contract that mints NFTs and sells them through a separate sales contract. |

Miscellaneous Contracts [​](#miscellaneous-contracts)
-----------------------------------------------------

| Contract | Description |
| --- | --- |
| [Use Object](./use-obj-example.html) | An example of how you might associate the ability to take an action with ownership of a particular digital asset. In this case, you can color a pixel if you own the NFT for the pixel. |
| [Automatic Refund](./automatic-refund.html) | A trivial contract that gives the user back what they put in. |

