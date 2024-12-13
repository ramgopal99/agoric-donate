

ZoeHelper Functions [​](#zoehelper-functions)
=============================================

The ZoeHelper functions provide convenient abstractions for accessing Zoe functionality from within contracts. In most cases, you pass a reference to zcf or one or more seats.

All of the ZoeHelper functions are described below. To use any of them, import them directly from **@agoric/zoe/src/contractSupport/index.js**. For example, the following imports the two ZoeHelper functions **[assertIssuerKeywords()](#assertissuerkeywords-zcf-expected)** and **[assertProposalShape()](#assertproposalshape-seat-expected)**:

js
```
import {
  assertIssuerKeywords,
  assertProposalShape
} from '@agoric/zoe/src/contractSupport/index.js';
```

atomicRearrange(zcf, transfers) [​](#atomicrearrange-zcf-transfers)
-------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **transfers**: **Array<[TransferPart](./zoe-data-types.html#transferpart)>**
* Returns: None.

Asks Zoe to rearrange the **[Allocations](./zoe-data-types.html#allocation)** among the seats mentioned in *transfers*. *transfers* are a set of changes to **Allocations** that must satisfy several constraints. If these constraints are all met, then the reallocation happens atomically. Otherwise an error is thrown and none of the proposed changes has any effect. The constraints are as follows.

* All the mentioned seats are still live.
* There aren't any outstanding stagings for any of the mentioned seats.
  
  Stagings are a reallocation mechanism that has been deprecated in favor of this **atomicRearrange()** function. To prevent confusion, each reallocation can only be expressed in the old way or the new way, but not a mixture.
* Overall conservation must be maintained. In other words, the reallocated **[Amounts](/reference/ertp-api/ertp-data-types.html#amount)** must balance out.
* Offer Safety is preserved for each seat. That means reallocations can only take assets from a seat as long as either it gets the assets described in the want section of its proposal, or it retains all of the assets specified in the give section of the proposal. This constraint applies to each seat across the entire atomicRearrangement, not to the individual **TransferParts**.

Note that you can construct the **TransferParts** that make up the *transfers* array manually, or for transfers that only include one seat, you can use the helper functions **[fromOnly()](#fromonly-fromseat-fromamounts)** and **[toOnly()](#toonly-toseat-toamounts)** to create **TransferParts** that only use a subset of the fields.

fromOnly(fromSeat, fromAmounts) [​](#fromonly-fromseat-fromamounts)
-------------------------------------------------------------------

* **fromSeat**: **[ZCFSeat](./zcfseat.html)**
* **fromAmounts**: **[AmountKeywordRecord](./zoe-data-types.html#keywordrecord)**
* Returns: **[TransferPart](./zoe-data-types.html#transferpart)**

Returns a **TransferPart** which only takes **fromAmounts** from *fromSeat*. **TransferParts** are used as part of the *transfer* argument of the **[atomicRearrange()](#atomicrearrange-zcf-transfers)** function.

toOnly(toSeat, toAmounts) [​](#toonly-toseat-toamounts)
-------------------------------------------------------

* **toSeat**: **[ZCFSeat](./zcfseat.html)**
* **toAmounts**: **[AmountKeywordRecord](./zoe-data-types.html#keywordrecord)**
* Returns: **[TransferPart](./zoe-data-types.html#transferpart)**

Returns a **TransferPart** which only gives **toAmount** to *toSeat*. **TransferParts** are used as part of the *transfer* argument of the **[atomicRearrange()](#atomicrearrange-zcf-transfers)** function.

atomicTransfer(zcf, fromSeat, toSeat, fromAmounts, toAmounts?) [​](#atomictransfer-zcf-fromseat-toseat-fromamounts-toamounts)
-----------------------------------------------------------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **fromSeat**: **[ZCFSeat](./zcfseat.html)** - Optional.
* **toSeat**: **ZCFSeat** - Optional.
* **fromAmounts**: **[AmountKeywordRecord](./zoe-data-types.html#keywordrecord)** - Optional.
* **toAmounts**: **AmountKeywordRecord** - Optional, defaults to **fromAmounts**.
* Returns: None.

Asks Zoe to rearrange the **[Allocations](./zoe-data-types.html#allocation)** among the seats mentioned in *fromSeat* and *toSeat*. The reallocations must satisfy several constraints. If these constraints are all met, then the reallocation happens atomically. Otherwise an error is thrown and none of the proposed changes has any effect. The constraints are as follows.

* All the mentioned seats are still live.
* There aren't any outstanding stagings for any of the mentioned seats.
  
  Stagings are a reallocation mechanism that has been deprecated in favor of this **atomicRearrange()** function. To prevent confusion, each reallocation can only be expressed in the old way or the new way, but not a mixture.
* Overall conservation must be maintained. In other words, the reallocated **[Amounts](/reference/ertp-api/ertp-data-types.html#amount)** must balance out.
* Offer Safety is preserved for each seat. That means reallocations can only take assets from a seat as long as either it gets the assets described in the want section of its proposal, or it retains all of the assets specified in the give section of the proposal. This constraint applies to each seat across the entire atomicRearrangement, not to the individual **TransferParts**.

When you don't specify *toAmounts*, it means that the *fromAmount* will be taken from *fromSeat* and given to *toSeat*.

assertIssuerKeywords(zcf, expected) [​](#assertissuerkeywords-zcf-expected)
---------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **expected**: **Array<String>**
* Returns: None.

Checks that the **[Keywords](./zoe-data-types.html#keyword)** in the *expected* argument match what the contract expects. The function throws an error if incorrect or extra **Keywords** are passed in, or if there are **Keywords** missing. The **Keyword** order is irrelevant.

js
```
import { assertIssuerKeywords } from '@agoric/zoe/src/contractSupport/index.js';

// Proposals for this contract instance use keywords 'Asset' and 'Price'
assertIssuerKeywords(zcf, harden(['Asset', 'Price']));
```

satisfies(zcf, seat, update) [​](#satisfies-zcf-seat-update)
------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **seat**: **[ZCFSeat](./zcfseat.html)**
* **update**: **[AmountKeywordRecord](./zoe-data-types.html#keywordrecord)**
* Returns: **Boolean**

Returns **true** if an update to a **seat**'s **currentAllocation** satisfies its **proposal.want**. Note this is half of the offer safety check; it does not check if the **[Allocation](./zoe-data-types.html#allocation)** constitutes a refund. The update is merged with **currentAllocation** such that *update*'s values prevail if the **[Keywords](./zoe-data-types.html#keyword)** are the same. If they are not the same, the **Keyword** and **value** is just added to the **currentAllocation**.

The following example code uses **satisfies()** to define a **satisfiedBy()** comparison function between two **seats**. It checks if the second **seat** argument's *currentAllocation* satisfies the first **seat** argument's **proposal.want**.

It then calls **satisfiedBy()** on both orders of the two **seats**. If both satisfy each other, it does a swap on them.

js
```
import { satisfies } from '@agoric/zoe/src/contractSupport/index.js';

const satisfiedBy = (xSeat, ySeat) =>
  satisfies(zcf, xSeat, ySeat.getCurrentAllocation());

if (satisfiedBy(offer, seat) && satisfiedBy(seat, offer)) {
  swap(zcf, seat, offer);
}
```

swap(zcf, leftSeat, rightSeat) [​](#swap-zcf-leftseat-rightseat)
----------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **leftSeat**: **[ZCFSeat](./zcfseat.html)**
* **rightSeat**: **ZCFSeat**
* Returns: **defaultAcceptanceMsg**

For both **seats**, everything a **seat** wants is given to it, having been taken from the other **seat**. **swap()** exits both **seats**. Use **swap()** when all of these are true:

* Both **seats** use the same **[Keywords](./zoe-data-types.html#keyword)**.
* The **seats**' wants can be fulfilled from the other **seat**.
* No further **seat** interaction is desired.

If the two **seats** can trade, they swap their compatible assets, exiting both **seats**. It returns the message **The offer has been accepted. Once the contract has been completed, please check your payout**.

Any surplus remains with whichever **seat** has the surplus. For example if **seat** A gives 5 Quatloos and **seat** B only wants 3 Quatloos, **seat** A retains 2 Quatloos.

If the swap fails, no assets transfer, and both *leftSeat* and *rightSeat* are exited.

js
```
import { swap } from '@agoric/zoe/src/contractSupport.js';

swap(zcf, firstSeat, secondSeat);
```

swapExact(zcf, leftSeat, rightSeat) [​](#swapexact-zcf-leftseat-rightseat)
--------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **leftSeat**: **[ZCFSeat](./zcfseat.html)**
* **rightSeat**: **ZCFSeat**
* Returns: **defaultAcceptanceMsg**

For both seats, everything a seat wants is given to it, having been taken from the other seat. **swapExact()** exits both seats. Use **swapExact()** when both of these are true:

* The **seats**' wants can be fulfilled from the other **seat**.
* No further **seat** interaction is desired.

Note that unlike the **swap()** function, *leftSeat* and *rightSeat* don't necessarily use the same **[Keywords](./zoe-data-types.html#keyword)**.

**swapExact()** is a special case of **swap()** such that it is successful only if both seats gain everything they want and lose everything they were willing to give. It is only good for exact and entire swaps where each seat wants everything that the other seat has. The benefit of using this method is that the **Keywords** of each seat do not matter.

If the two **seats** can trade, they swap their compatible assets, exiting both **seats**. It returns the message **The offer has been accepted. Once the contract has been completed, please check your payout**.

If the swap fails, no assets transfer, and both *leftSeat* and *rightSeat* are exited.

js
```
import { swapExact } from '@agoric/zoe/src/contractSupport/index.js';

const swapMsg = swapExact(zcf, zcfSeatA, zcfSeatB);
```

fitProposalShape(seat, proposalShape) [​](#fitproposalshape-seat-proposalshape)
-------------------------------------------------------------------------------

* **seat**: **[ZCFSeat](./zcfseat.html)**
* **proposalShape**: **[Pattern](https://github.com/endojs/endo/tree/master/packages/patterns#readme)**
* Returns: None.

Checks the seat's proposal against the *proposalShape* argument. If the proposal does not match *proposalShape*, the seat will be exited and all **[Payments](/reference/ertp-api/payment.html)** will be refunded.

assertProposalShape(seat, expected) [​](#assertproposalshape-seat-expected)
---------------------------------------------------------------------------

* **seat**: **[ZCFSeat](./zcfseat.html)**
* **expected**: **ExpectedRecord**
* Returns: None.

**Note: Most uses of `assertProposalShape` are better expressed using the `proposalShape` argument of [zcf.makeInvitation()](./zoe-contract-facet.html#zcf-makeinvitation-offerhandler-description-customdetails-proposalshape)**.

Checks the seat's proposal against an *expected* record that says what shape of proposal is acceptable.

By "shape", we mean the **give**, **want**, and **exit** rule **[Keywords](./zoe-data-types.html#keyword)** of the proposal must be equal to those in *expected*. Note that **exit** rule **Keywords** are optional in *expected*. Also, none of the values of those **Keywords** are checked.

This **ExpectedRecord** is like a **Proposal**, but the amounts in **want** and **give** should be **null**; the **exit** clause should specify a rule with **null** contents. If the client submits a **Proposal** which does not match these expectations, that **proposal** is rejected (and refunded).

js
```
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';

const sellAssetForPrice = harden({
  give: { Asset: null },
  want: { Price: null }
});
const sell = seat => {
  assertProposalShape(seat, sellAssetForPrice);
  buySeats = swapIfCanTradeAndUpdateBook(buySeats, sellSeats, seat);
  return 'Trade Successful';
};
```

assertNatAssetKind(zcf, brand) [​](#assertnatassetkind-zcf-brand)
-----------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **brand**: **[Brand](/reference/ertp-api/brand.html)**
* Returns: **Boolean**

Asserts that the *brand* is [AssetKind.NAT](/reference/ertp-api/ertp-data-types.html#assetkind). This means the corresponding **[Mint](/reference/ertp-api/mint.html)** creates fungible assets.

If **false** throws with message **brand must be AssetKind.NAT**.

js
```
import { assertNatAssetKind } from '@agoric/zoe/src/contractSupport/index.js';

assertNatAssetKind(zcf, quatloosBrand);
```

depositToSeat(zcf, recipientSeat, amounts, payments) [​](#deposittoseat-zcf-recipientseat-amounts-payments)
-----------------------------------------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **recipientSeat**: **[ZCFSeat](./zcfseat.html)**
* **amounts**: **[AmountKeywordRecord](./zoe-data-types.html#allocation)**
* **payments**: **PaymentPKeywordRecord**
* Returns: **Promise<String>**

Deposits payments such that their amounts are reallocated to a seat. The **amounts** and **payments** records must have corresponding **[Keywords](./zoe-data-types.html#keyword)**.

If the seat has exited, aborts with the message **The recipientSeat cannot have exited.**

On success, returns the exported and settable **depositToSeatSuccessMsg** which defaults to **Deposit and reallocation successful.**

js
```
import { depositToSeat } from '@agoric/zoe/src/contractSupport/index.js';

await depositToSeat(
  zcf,
  zcfSeat,
  { Dep: quatloos(2n) },
  { Dep: quatloosPayment }
);
```

withdrawFromSeat(zcf, seat, amounts) [​](#withdrawfromseat-zcf-seat-amounts)
----------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **seat**: **[ZCFSeat](./zcfseat.html)**
* **amounts**: **[AmountKeywordRecord](./zoe-data-types.html#allocation)**
* Returns: **Promise<PaymentPKeywordRecord>**

Withdraws payments from a seat. Note that withdrawing the amounts of the payments must not and cannot violate offer safety for the seat. The **amounts** and **payments** records must have corresponding **[Keywords](./zoe-data-types.html#keyword)**.

If the seat has exited, aborts with the message **The seat cannot have exited.**

Unlike **depositToSeat()**, a **PaymentPKeywordRecord** is returned, not a success message.

js
```
import { withdrawFromSeat } from '@agoric/zoe/src/contractSupport/index.js';

const paymentKeywordRecord = await withdrawFromSeat(zcf, zcfSeat, {
  With: quatloos(2n)
});
```

saveAllIssuers(zcf, issuerKeywordRecord) [​](#saveallissuers-zcf-issuerkeywordrecord)
-------------------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **issuerKeywordRecord**: **IssuerKeywordRecord**
* Returns: **Promise<PaymentPKeywordRecord>**

Saves all of the issuers in an **IssuersKeywordRecord** to ZCF, using the method [**zcf.saveIssuer()**](./zoe-contract-facet.html#zcf-saveissuer-issuer-keyword).

This does **not** error if any of the **[Keywords](./zoe-data-types.html#keyword)** already exist. If the **Keyword** is already present, it is ignored.

js
```
import { saveAllIssuers } from '@agoric/zoe/src/contractSupport/index.js';

await saveAllIssuers(zcf, { G: gIssuer, D: dIssuer, P: pIssuer });
```

offerTo(zcf, invitation, keywordMapping, proposal, fromSeat, toSeat, offerArgs) [​](#offerto-zcf-invitation-keywordmapping-proposal-fromseat-toseat-offerargs)
--------------------------------------------------------------------------------------------------------------------------------------------------------------

* **zcf**: **[ZoeContractFacet](./zoe-contract-facet.html)**
* **invitation**: **ERef<[Invitation](./zoe-data-types.html#invitation)>**
* **keywordMapping**: **KeywordRecord**
* **proposal**: **Proposal**
* **fromSeat**: **[ZCFSeat](./zcfseat.html)**
* **toSeat**: **ZCFSeat**
* **offerArgs**: **Object**
* Returns: **OfferToReturns**

**offerTo()** makes an offer from your current contract instance (which we'll call "contractA") to another contract instance (which we'll call "contractB"). It withdraws offer payments from the *fromSeat* in contractA and deposits any payouts in the *toSeat*, also a contractA seat. Note that *fromSeat* and *toSeat* may be the same seat, which is the default condition (i.e. *toSeat* is an optional parameter defaulting to *fromSeat*'s value). **offerTo()** can be used to make an offer from any contract instance to any other contract instance, as long as the *fromSeat* allows the withdrawal without violating offer-safety. To be clear, this does mean that contractA and contractB do not have to be instances of the same contract.

*zcf* is contractA's Zoe contract facet. The *invitation* parameter is an **Invitation** to contractB. The *proposal* parameter is the proposal part of the offer made to contractB.

*keywordMapping* is a record of the **[Keywords](./zoe-data-types.html#keyword)** used in contractA mapped to the **Keywords** for contractB. Note that the pathway to deposit the payout back to contractA reverses this mapping. It looks like this, where the **Keywords** are from the contracts indicated by using "A" or "B" in the **Keyword** name.

js
```
// Map the keywords in contractA to the keywords in contractB
const keywordMapping = harden({
  TokenA1: 'TokenB1',
  TokenA2: 'TokenB2'
});
```

*offerArgs* is an object that can be used to pass additional arguments to the **offerHandler** of contractB's contract code. Which arguments should be included within *offerArgs* is determined by the contract in question; each contract can define whatever additional arguments it requires. If no additional arguments are defined for a particular contract, then the *offerArgs* argument can be omitted entirely. It is up to the contract code how it chooses to handle any unexpected or missing arguments within *offerArgs*.

Contract code should be careful interacting with *offerArgs*. These values need input validation before being used by the contract code since they are coming directly from the user and may have malicious behavior.

The **OfferToReturns** return value is a promise for an object containing the **userSeat** for the offer to the other contract, and a promise (**deposited**) that resolves when the payout for the offer has been deposited to the **toSeat**. Its two properties are:

* **userSeatPromise**: **Promise<UserSeat>**
* **deposited**: **Promise<AmountKeywordRecord>**

js
```
const { userSeatPromise: AMMUserSeat, deposited } = zcf.offerTo(
  swapInvitation,
  keywordMapping, // {}
  proposal,
  fromSeat,
  lenderSeat
);
```

prepareRecorderKitMakers(baggage, marshaller) [​](#preparerecorderkitmakers-baggage-marshaller)
-----------------------------------------------------------------------------------------------

Convenience wrapper for DurablePublishKit and Recorder kinds.

TIP

This defines two durable kinds. Must be called at most once per baggage.

* `makeRecorderKit` is suitable for making a durable `RecorderKit` which can be held in Exo state.
* `makeERecorderKit` is for closures that must return a `subscriber` synchronously but can defer the `recorder`.

js
```
@param {import('@agoric/vat-data').Baggage} baggage
@param {ERef<Marshaller>} marshaller
```

Source: [@agoric/zoe/src/contractSupport/recorder.js#L215](https://github.com/Agoric/agoric-sdk/blob/5a6cdeb0c18ae9700d706445acf402f8d1e873c3/packages/zoe/src/contractSupport/recorder.js#L215)

