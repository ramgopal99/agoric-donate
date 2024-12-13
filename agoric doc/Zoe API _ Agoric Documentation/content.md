

Zoe API [​](#zoe-api)
=====================

 Zoe v0.24.0. Last updated August 25, 2022. 

The Zoe framework provides a way to write smart contracts without having to worry about [offer safety](/guides/zoe/offer-safety.html). To use Zoe, we put things in terms of "offers". An offer proposal is a statement about what you want and what you're willing to offer. It turns out, many smart contracts (apart from gifts and one-way payments) involve an exchange of digital assets that can be put in terms of offer proposals.

Start creating your own contract or build on any of our existing contracts. Explore our [pre-built contracts](/guides/zoe/contracts/index.html).

The Zoe API supports the following objects:

| Object | Description |
| --- | --- |
| [Zoe Service](./zoe.html) | Deploys and works with smart contracts. |
| [UserSeat](./user-seat.html) | Used outside contracts to access or manipulate offers. |
| [Zoe Contract Facet](./zoe-contract-facet.html) | Accesses a running contract instance. |
| [ZCFSeat](./zcfseat.html) | Used within contracts to access or manipulate offers. |
| [ZCFMint](./zcfmint.html) | Used by a contract to issue digital assets. |

The Zoe API provides the following libraries:

| Library | Description |
| --- | --- |
| [ZoeHelpers](./zoe-helpers.html) | Functions that extract common contract code and patterns into reusable helpers. |
| [Ratio Math](./ratio-math.html) | Functions that let you create and manipulate **[Ratios](./zoe-data-types.html#ratio)**. |

The Zoe API introduces and uses the following data types:

| Data Type | Description |
| --- | --- |
| [Allocation](./zoe-data-types.html#allocation) | The **[Amounts](/reference/ertp-api/ertp-data-types.html#amount)** to be paid out to each seat upon exiting an **Offer**. |
| [AmountKeywordRecord](./zoe-data-types.html#keywordrecord) | A record in which the property names are **Keywords** and the values are **[Amounts](/reference/ertp-api/ertp-data-types.html#amount)**. |
| [Handle](./zoe-data-types.html#handle) | A **Far** object without any methods whose only useful property is its unique identity. |
| [Instance](./zoe-data-types.html#instance) | A handle to an opaque object that represents a contract instance. |
| [Invitation](./zoe-data-types.html#invitation) | A non-fungible eright that can be held in **[Payments](/reference/ertp-api/payment.html)** or **[Purses](/reference/ertp-api/purse.html)**, just like any other eright. |
| [InvitationIssuer](./zoe-data-types.html#invitationissuer) | An **[Issuer](/reference/ertp-api/issuer.html)** for **[Invitations](./zoe-data-types.html#invitation)**, which grant the right to participate in a contract. |
| [Keyword](./zoe-data-types.html#keyword) | An ASCII identifier string that must begin with an upper case letter. |
| [ParsableNumber](./zoe-data-types.html#parsablenumber) | Defined as a **bigint**, **number**, or **string**. |
| [Ratio](./zoe-data-types.html#ratio) | Pass-by-value record that consists of a *numerator* **[Amount](/reference/ertp-api/ertp-data-types.html#amount)** and a *denominator* **Amount**. |
| [TransferPart](./zoe-data-types.html#transferpart) | **[Allocation](./zoe-data-types.html#allocation)** changes for one or two existing **[ZCFSeats](./zcfseat.html)**. **TransferParts** are the individual elements of the *transfer* array passed into the **[atomicRearrange()](./zoe-helpers.html#atomicrearrange-zcf-transfers)** function. |

