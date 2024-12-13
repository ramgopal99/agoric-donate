

Mint and Sell NFTs Contract [​](#mint-and-sell-nfts-contract)
=============================================================

 Zoe v0.24.0. Last updated August 25, 2022. 
##### [View the code on Github](https://github.com/Agoric/agoric-sdk/blob/4e0aece631d8310c7ab8ef3f46fad8981f64d208/packages/zoe/src/contracts/mintAndSellNFT.js) (Last updated: Jan 31, 2022) [​](#view-the-code-on-github-last-updated-jan-31-2022)

##### [View all contracts on Github](https://github.com/Agoric/agoric-sdk/tree/master/packages/zoe/src/contracts) [​](#view-all-contracts-on-github)

This contract mints non-fungible tokens and creates a selling contract instance to sell the tokens in exchange for some sort of money.

startInstance() returns a creatorFacet with a `.sellTokens()` method. `.sellTokens()` takes a specification of what is being sold, such as:

```
{
  customValueProperties: { ...arbitrary },
  count: 3,
  moneyIssuer: moolaIssuer,
  sellItemsInstallationHandle,
  pricePerItem: AmountMath.make(moolaBrand, 20n),
}
```

The `offerResult` is a record with useful properties such as the `creatorFacet` for the sales contract. You can reuse the `creatorFacet` of this contract to mint more batches of NFTs (e.g. more tickets for a separate show.)

