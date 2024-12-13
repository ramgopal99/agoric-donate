

Zoe Data Types [​](#zoe-data-types)
===================================

Zoe introduces and uses several data types.

Allocation [​](#allocation)
---------------------------

**Allocations** represent the **[Amounts](/reference/ertp-api/ertp-data-types.html#amount)** to be paid out to each seat upon exiting a **Proposal**.

For example, if a seat expected to be paid 5 *Quatloos* and 3 *Widgets* after successfully exiting a **Proposal**, the **Allocation** would look like:

js
```
{
  Quatloos: 5n;
  Widgets: 3n;
}
```

Handle [​](#handle)
-------------------

**Handles** are **Far** objects without any methods whose only useful property are their unique identities. They're often created in order to designate some other object, where the **Handles** can be passed around as reliable designators without giving access to the designated objects.

Instance [​](#instance)
-----------------------

An **Instance** is a handle that represents an instance of a contract. You can get information about the contract instance via these methods:

* **[E(Zoe).getBrands()](./zoe.html#e-zoe-getbrands-instance)**
* **[E(Zoe).getIssuers()](./zoe.html#e-zoe-getissuers-instance)**
* **[E(Zoe).getTerms()](./zoe.html#e-zoe-getterms-instance)**
* **[E(Zoe).getPublicFacet()](./zoe.html#e-zoe-getpublicfacet-instance)**

Invitation [​](#invitation)
---------------------------

An **Invitation** is a non-fungible asset created by the **[InvitationIssuer](#invitationissuer)**. An **Invitation Payment** is a **[Payment](/reference/ertp-api/payment.html)** holding an **Invitation**.

InvitationIssuer [​](#invitationissuer)
---------------------------------------

The **InvitationIssuer** is an **[Issuer](/reference/ertp-api/issuer.html)** that plays a special role throughout Zoe. Zoe has a single **InvitationIssuer** for its entire lifetime. All **Invitations** come from the **[Mint](/reference/ertp-api/mint.html)** associated with the Zoe instance's **InvitationIssuer**.

The issuer is publicly available (via [`E(Zoe).getInvitationIssuer()`](./zoe-contract-facet.html#zcf-getinvitationissuer)), so the ability to validate invitations is widely available.

**InvitationIssuer** has all the methods of regular **Issuers**, but the two methods that are most often used are **[anIssuer.claim()](/reference/ertp-api/issuer.html#anissuer-claim-payment-optamount)** and **[anIssuer.getAmountOf()](/reference/ertp-api/issuer.html#anissuer-getamountof-payment)**.

A successful call of **anInvitationIssuer.claim()** means you are assured the **Invitation** passed into the method is recognized as valid by the **InvitationIssuer**. You are also assured the **Invitation** is exclusively yours and no one else has access to it.

Keyword [​](#keyword)
---------------------

A **Keyword** is a unique identifier string within a contract for tying together the **issuers** in its **proposals**, **payments**, and **payouts**. It must be an ASCII-only [identifier](https://developer.mozilla.org/en-US/docs/Glossary/Identifier) and start with an upper case letter in order to avoid collisions with JavaScript properties such as `toString` when used as a property name in a record. (For more detail, see [Why do Zoe keywords have to start with a capital letter? #8241](https://github.com/Agoric/agoric-sdk/discussions/8241).) `NaN` and `Infinity` are also not allowed as keywords.

KeywordRecord [​](#keywordrecord)
---------------------------------

A **KeywordRecord** is a [CopyRecord](/glossary/#copyrecord) in which every property name is a **[Keyword](#keyword)**, such as `harden({ Asset: moolaIssuer, Bid: simoleanIssuer })`. Subtypes further constrain property values (for example, an **AmountKeywordRecord** is a **KeywordRecord** in which every value is an **[Amount](/reference/ertp-api/ertp-data-types.html#amount)** and a **PaymentPKeywordRecord** is a **KeywordRecord** in which every value is either a **[Payment](/reference/ertp-api/payment.html)** or a Promise for a Payment).

Users submit their **payments** as **KeywordRecords**:

js
```
const aFistfulOfQuatloos = AmountMath.make(quatloosBrand, 1000n);
const paymentKeywordRecord = {
  Asset: quatloosPurse.withdraw(aFistfulOfQuatloos)
};
```

ParsableNumber [​](#parsablenumber)
-----------------------------------

A **ParsableNumber** is defined as a **bigint**, **number**, or **string**.

Ratio [​](#ratio)
-----------------

**Ratios** are pass-by-value records that consist of a *numerator* and a *denominator*. Both of these consist of a **[AmountValue](/reference/ertp-api/ertp-data-types.html#amountvalue)** and a **[Brand](/reference/ertp-api/brand.html)**, just like **[Amounts](/reference/ertp-api/ertp-data-types.html#amount)**. A **Ratio** cannot have a denominator value of 0.

The most common kind of **Ratio** is applied to an **Amount** of a particular **Brand** and produces results of the same **Brand**.

**Ratios** can also have two different **Brands**, essentially typing them such as miles per hour or US dollars for Swiss francs (i.e., an exchange rate ratio).

TransferPart [​](#transferpart)
-------------------------------

**TransferParts** are the individual elements of the *transfer* array passed into the **[atomicRearrange()](./zoe-helpers.html#atomicrearrange-zcf-transfers)** function. Each **TransferPart** represents one or two **[Allocation](#allocation)** changes among existing **[ZCFSeats](./zcfseat.html)**. Each **TransferPart** consists of 4 elements, each of which can be elided in some cases:

* **fromSeat**?: **ZCFSeat** - The seat from which **amounts** are being taken.
* **toSeat**?: **ZCFSeat** - The seat to which **amounts** are being given.
* **fromAmounts**?: **[AmountKeywordRecord](#keywordrecord)** - The **amounts** which will be taken from the *fromSeat*.
* **toAmounts**?: **AmountKeywordRecord** - The **amounts** which will be given to the *toSeat*.

If a *fromSeat* is specified, then a *fromAmounts* is required. When you specify a *toSeat* without specifying a *toAmounts*, it means that the *fromAmount* will be taken from *fromSeat* and given to *toSeat*.

**TransferParts** that represent one side of a transfer can be created using the helper functions **[fromOnly()](./zoe-helpers.html#fromonly-fromseat-fromamounts)** or **[toOnly()](./zoe-helpers.html#toonly-toseat-toamounts)**. Of course, as with any JavaScript datatype, you can also manually create **TransferParts**. If you manually create a **TransferPart** and don't include the *fromSeat*, *toSeat*, and/or *fromAmounts* fields, you'll need to set the missing fields to **undefined**. (Note that if you don't include the *toAmounts* field, there's no need to set it to **undefined**; you can simply omit it.)

