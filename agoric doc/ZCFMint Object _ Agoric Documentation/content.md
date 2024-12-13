

ZCFMint Object [​](#zcfmint-object)
===================================

An object used by the **[Zoe Contract Facet](./zoe-contract-facet.html)** to issue digital assets. It's very similar to the **[Mint](/reference/ertp-api/mint.html)** object, but it has a more limited set of methods.

**ZCFMints** are created and returned by **Zoe Contract Facet's** **[zcf.makeZCFMint()](./zoe-contract-facet.html#zcf-makezcfmint-keyword-assetkind-displayinfo)** method.

aZCFMint.getIssuerRecord() [​](#azcfmint-getissuerrecord)
---------------------------------------------------------

* Returns: **IssuerRecord**

Returns an **IssuerRecord** containing the **[Issuer](/reference/ertp-api/issuer.html)** and **[Brand](/reference/ertp-api/brand.html)** associated with the **zcfMint**.

aZCFMint.mintGains(gains, zcfSeat?) [​](#azcfmint-mintgains-gains-zcfseat)
--------------------------------------------------------------------------

* **gains**: **[AmountKeywordRecord](./zoe-data-types.html#keywordrecord)**
* **zcfSeat**: **[ZCFSeat](./zcfseat.html)** - Optional.
* Returns: **ZCFSeat**

All **amounts** in *gains* must be of this **ZCFMint**'s **[Brand](/reference/ertp-api/brand.html)** and the *gains*' **[Keywords](./zoe-data-types.html#keyword)** should be defined by the contract instance in which *zcfSeat* is participating. If *zcfSeat* is not provided, a new **seat** is used. Mints the *gains* **Amount** of assets and adds them to *zcfSeat*'s **[Allocation](./zoe-data-types.html#allocation)**, then returns *zcfSeat*.

aZCFMint.burnLosses(losses, zcfSeat) [​](#azcfmint-burnlosses-losses-zcfseat)
-----------------------------------------------------------------------------

* **losses**: **[AmountKeywordRecord](./zoe-data-types.html#keywordrecord)**
* **zcfSeat**: **[ZCFSeat](./zcfseat.html)**
* Returns: None

All **amounts** in *losses* must be of this **ZCFMint**'s **[Brand](/reference/ertp-api/brand.html)** and the *losses*' **[Keywords](./zoe-data-types.html#keyword)** must be defined by the contract instance in which *zcfSeat* is participating. Subtracts *losses* from *zcfSeat*'s **[Allocation](./zoe-data-types.html#allocation)**, then burns that **amount** from the assets escrowed by Zoe for this contract instance.

