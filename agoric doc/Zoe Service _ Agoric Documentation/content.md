

Zoe Service [​](#zoe-service)
=============================

 Zoe v0.24.0. Last updated August 25, 2022. 

Zoe provides a framework for deploying and working with smart contracts. It is accessed as a long-lived and well-trusted service that enforces offer safety for the contracts that use it. Zoe has a single **[InvitationIssuer](./zoe-data-types.html#invitationissuer)** for the entirety of its lifetime. By having a reference to Zoe, a user can get the **InvitationIssuer** and thus validate any **[Invitation](./zoe-data-types.html#invitation)** they receive from someone else.

Zoe is accessed asynchronously

The Zoe service is accessed asynchronously, using a standards-track library extension to JavaScript that uses promises as remote references. In code, the Zoe service instance is referred to via **Zoe**, which only supports asynchronous invocation. Operations are invoked asynchronously using the [**E** helper for async messaging](https://github.com/tc39/proposal-eventual-send#e-and-esendonly-convenience-proxies). All such operations immediately return a promise for their result. That may eventually fulfill to a local value, or to a **Presence** for another remote object (e.g., in another contract or service, running on another chain, etc.). Asynchronous messages can be sent using **E** with either promises or presences.

For more information about using **E**, see the [Agoric's JavaScript Distributed Programming Guide](/guides/js-programming/eventual-send.html).

E(Zoe).getBrands(instance) [​](#e-zoe-getbrands-instance)
---------------------------------------------------------

* **instance**: **[Instance](./zoe-data-types.html#instance)**
* Returns: **Promise<BrandKeywordRecord>**

Returns a **Promise** for a **BrandKeywordRecord** containing all **[Brands](/reference/ertp-api/brand.html)** defined in the *instance* argument.

A **BrandKeywordRecord** is an object where the keys are **[Keywords](./zoe-data-types.html#keyword)**, and the values are the **Brands** for particular **[Issuers](/reference/ertp-api/issuer.html)**.

js
```
// Record example
const brandKeywordRecord = {
  FirstCurrency: quatloosBrand,
  SecondCurrency: moolaBrand
  // etc.
};
```
js
```
// Call example
const brandKeywordRecord = await E(Zoe).getBrands(instance);
```

E(Zoe).getIssuers(instance) [​](#e-zoe-getissuers-instance)
-----------------------------------------------------------

* **instance**: **[Instance](./zoe-data-types.html#instance)**
* Returns: **Promise<IssuerKeywordRecord>**

Returns a **Promise** for an **IssuerKeywordRecord** containing all **[Issuers](/reference/ertp-api/issuer.html)** defined in the *instance* argument.

An **IssuerKeywordRecord** is an object where the keys are **[Keywords](./zoe-data-types.html#keyword)**, and the values are **Issuers**.

js
```
// Record example
const issuerKeywordRecord = {
  FirstCurrency: quatloosIssuer,
  SecondCurrency: moolaIssuer
};
```
js
```
// Call example
const issuerKeywordRecord = await E(Zoe).getIssuers(instance);
```

E(Zoe).getTerms(instance) [​](#e-zoe-getterms-instance)
-------------------------------------------------------

* **instance**: **[Instance](./zoe-data-types.html#instance)**
* Returns: **Promise<Object>**

Returns a **Promise** for the terms of the *instance* argument, including its **[Brands](/reference/ertp-api/brand.html)**, **[Issuers](/reference/ertp-api/issuer.html)**, and any custom terms. The returned values look like:

js
```
{
  // Brands and issuers are keywordRecords
  brands: { A: moolaKit.brand, B: simoleanKit.brand },
  issuers: { A: moolaKit.issuer, B: simoleanKit.issuer },
  customTermA: 'something',
  customTermB: 'something else',
  // All other customTerms
};
```
js
```
const terms = await E(Zoe).getTerms(instance);
```

E(Zoe).getPublicFacet(instance) [​](#e-zoe-getpublicfacet-instance)
-------------------------------------------------------------------

* **instance**: **[Instance](./zoe-data-types.html#instance)**
* Returns: **Promise<PublicFacet>**

Returns a **Promise** for the **PublicFacet** defined for the *instance* argument.

A contract instance's **PublicFacet** is an object available via Zoe to anyone knowing that **Instance**. You use it for general queries and actions, such as getting a current price or creating public **[Invitations](./zoe-data-types.html#invitation)**. Since a facet is defined just as any other object, the contract adds methods to the **PublicFacet** just like you would any object.

js
```
const ticketSalesPublicFacet = await E(Zoe).getPublicFacet(sellItemsInstance);
```

E(Zoe).getInvitationIssuer() [​](#e-zoe-getinvitationissuer)
------------------------------------------------------------

* Returns: **Promise<[InvitationIssuer](./zoe-data-types.html#invitationissuer)>**

Returns a **Promise** for the **InvitationIssuer** for the Zoe instance.

js
```
const invitationIssuer = await E(Zoe).getInvitationIssuer();
// Here a user, Bob, has received an untrusted invitation from Alice.
// Bob uses the trusted **InvitationIssuer** from Zoe to
// transform the untrusted invitation to a trusted one
const trustedInvitation = await invitationIssuer.claim(untrustedInvitation);
const { value: invitationValue } =
  await E(invitationIssuer).getAmountOf(trustedInvitation);
```

E(Zoe).getInvitationDetails(invitation) [​](#e-zoe-getinvitationdetails-invitation)
-----------------------------------------------------------------------------------

* **invitation**: **[Invitation](./zoe-data-types.html#invitation)**
* Returns **Promise<Object>**

Takes an **Invitation** as an argument and returns a **Promise** for an object containing the following details about the **Invitation**:

* **installation**: **Installation**: The contract's Zoe installation.
* **instance**: **[Instance](./zoe-data-types.html#instance)**: The contract instance this invitation is for.
* **invitationHandle**: **[Handle](./zoe-data-types.html#handle)**: A **Handle** used to refer to this **Invitation**.
* **description**: **String**: Describes the purpose of this **Invitation**. Use it to match the invitation to the role it plays in the contract.

js
```
const invitation = await invitationIssuer.claim(untrustedInvitation);
const invitationValue = await E(Zoe).getInvitationDetails(invitation);
```

E(Zoe).install(bundle) [​](#e-zoe-install-bundle)
-------------------------------------------------

* **bundle**: **SourceBundle**
* Returns: **Promise<Installation>**

Takes bundled source code for a Zoe contract as an argument and installs the code on Zoe. Returns a **Promise** for an **Installation** object.

js
```
// bundleSource takes source code files and
// bundles them together in the format install expects.
import bundleSource from '@endto/bundle-source';
const bundle = await bundleSource(pathResolve(`./src/contract.js`));
const installationP = await E(Zoe).install(bundle);
```

E(Zoe).getConfiguration() [​](#e-zoe-getconfiguration)
------------------------------------------------------

* Returns: **Promise<Object>**

Returns a **Promise** for information about the feeIssuer. (The **Issuer** whose associated **[Mint](/reference/ertp-api/mint.html)** can mint IST.) It consists of the issuer's name, assetKind, and displayInfo.

E(Zoe).getFeeIssuer() [​](#e-zoe-getfeeissuer)
----------------------------------------------

* Returns: **Promise<[Issuer](/reference/ertp-api/issuer.html)>**

Returns a **Promise** for the **Issuer** whose associated **[Mint](/reference/ertp-api/mint.html)** can mint IST.

E(Zoe).getOfferFilter(instance) [​](#e-zoe-getofferfilter-instance)
-------------------------------------------------------------------

* **instance**: **[Instance](./zoe-data-types.html#instance)**
* Returns: **Array<String>**

Returns all the offer **[Keywords](./zoe-data-types.html#keyword)** that have been disabled, if any. Offer **Keywords** may be disabled if they prove problematic in some fashion, or to debug undesired behavior.

E(Zoe).getInstance(invitation) [​](#e-zoe-getinstance-invitation)
-----------------------------------------------------------------

* **invitation**: **[Invitation](./zoe-data-types.html#invitation)**
* Returns: **Promise<[Instance](./zoe-data-types.html#instance)>**

Returns a **Promise** for the contract **instance** the **Invitation** is part of.

While **Instances** are opaque objects, you can get information about them via these methods:

* **getBrands()**
* **getTerms()**
* **getIssuers()**
* **getPublicFacet()**

js
```
const instance = await E(Zoe).getInstance(invitation);
```

E(Zoe).getProposalShapeForInvitation(invitation) [​](#e-zoe-getproposalshapeforinvitation-invitation)
-----------------------------------------------------------------------------------------------------

* **invitation**: **[Invitation](./zoe-data-types.html#invitation)**
* Returns: **Promise<[Pattern](https://github.com/endojs/endo/tree/master/packages/patterns#readme)>**

Returns a **Promise** for the **Pattern** that the **Invitation's** **Proposal** adheres to. See also [Proposal Shapes](./zoe-contract-facet.html#proposal-shapes).

E(Zoe).getInstallation(invitation) [​](#e-zoe-getinstallation-invitation)
-------------------------------------------------------------------------

* **invitation**: **[Invitation](./zoe-data-types.html#invitation)**
* Returns: **Promise<Installation>**

Returns a **Promise** for the contract **installation** the **Invitation**'s contract instance uses.

js
```
const installation = await E(Zoe).getInstallation(invitation);
```

E(Zoe).getInstallationForInstance(instance) [​](#e-zoe-getinstallationforinstance-instance)
-------------------------------------------------------------------------------------------

* **instance**: **[Instance](./zoe-data-types.html#instance)**
* Returns **Promise<Installation>**

Returns a **Promise** for the contract **installation** used by the **instance**. An **instance** is the unique identifier for the running, executing contract. The **installation** is the unique identifier for the underlying code. This method can be used as part of a process to inspect the underlying code for a running contract **instance**.

js
```
const installation = await E(Zoe).getInstallationForInstance(instance);
```

E(Zoe).startInstance(installation, issuerKeywordRecord?, terms?, privateArgs?) [​](#e-zoe-startinstance-installation-issuerkeywordrecord-terms-privateargs)
-----------------------------------------------------------------------------------------------------------------------------------------------------------

* **installation**: **ERef<Installation>**
* **issuerKeywordRecord**: **IssuerKeywordRecord** - Optional.
* **terms**: **Object** - Optional.
* **privateArgs**: **Object** - Optional.
* Returns: **Promise<StartInstanceResult>**

Creates an instance of the installed smart contract specified by the *installation* argument. All contracts each run in a new vat with their own version of the Zoe Contract Facet. There is one vat that contains the Zoe Service.

The *issuerKeywordRecord* is an optional object mapping **[Keywords](./zoe-data-types.html#keyword)** to **[Issuers](/reference/ertp-api/issuer.html)**, such as **FirstCurrency: quatlooIssuer**. Parties to the contract will use the **Keywords** to index their proposal and their payments.

The **terms** are values used by this contract instance, such as the number of bids an auction w ill wait for before closing. These values may be different for different instances of the same contract, but the contract defines what variables need their values passed in as **terms**.

**privateArgs** are optional. Pass an object record here with any values that need to be made available to the contract code, but which should not be in the public terms. For example, to share minting authority among multiple contracts, pass in the following as **privateArgs**:

js
```
const privateArgs = { externalMint: myExternalMint };
```

It returns a **Promise** for a **StartInstanceResult** object. The object consists of:

* **adminFacet**: **AdminFacet**
* **creatorFacet**: **any**
* **publicFacet**: **any**
* **instance**: **Instance**
* **creatorInvitation**: **Payment | undefined**

The **adminFacet** has four methods:

* **getVatShutdownPromise()**
  
  + Returns a promise that resolves to reason (the value passed to **fail(reason)**) or completion (the value passed to **exit(completion)**) when this newly started instance terminates.
* **restartContract(newPrivateArgs?)**
  
  + **newPrivateArgs**: **any** - Optional
  + returns VatUpgradeResults (a record with one field: incarnationNumber)
  
  Restarts the contract without changing the contract bundle
* **upgradeContract(contractBundleId, newPrivateArgs)**
  
  + **contractBundleId**: **string**
  + **newPrivateArgs**: **any** - Optional
  + returns VatUpgradeResults (a record with one field: incarnationNumber)
  
  Upgrades the contract to use source code from a new bundle.
  
  See [Contract Upgrade](/guides/zoe/contract-upgrade.html) for a description the process of upgrading contracts.
* **terminateContract(reason)**
  
  + **reason**: **Error**
  
  terminates the contract. `reason` will be provided as the failure reason.

A **publicFacet** is an object available via Zoe to anyone knowing the instance they are associated with. The **publicFacet** is used for general queries and actions, such as getting a current price or creating public **[Invitations](./zoe-data-types.html#invitation)**. Since a facet is defined just as any other object, the contract developer can add methods to them just like they would any object.

The **creatorFacet** is only available in this return value (i.e. only when starting a contract instance). The contract designer should use it to encapsulate things that the contract runner might not want to share, or might want to control the distribution of. The party who starts the contract should carefully consider the impact before sharing access to the **creatorFacet**.

**creatorInvitation** is an **Invitation** that the contract instance creator can use. It is usually used in contracts where the creator immediately sells something (auctions, swaps, etc.), so it's helpful for the creator to have an **Invitation** to escrow and sell goods. Remember that Zoe **Invitations** are represented as a **Payment**.

js
```
const issuerKeywordRecord = {
  Asset: moolaIssuer,
  Price: quatlooIssuer
};
const terms = { numBids: 3 };
const { creatorFacet, publicFacet, creatorInvitation } = await E(
  Zoe
).startInstance(installation, issuerKeywordRecord, terms);
```

E(Zoe).offer(invitation, proposal?, paymentPKeywordRecord?, offerArgs?) [​](#e-zoe-offer-invitation-proposal-paymentpkeywordrecord-offerargs)
---------------------------------------------------------------------------------------------------------------------------------------------

* **invitation**: **[Invitation](./zoe-data-types.html#invitation) | Promise<[Invitation](./zoe-data-types.html#invitation)>**
* **proposal**: **[Proposal](/glossary/#proposal)** - Optional.
* **paymentPKeywordRecord**: **[PaymentPKeywordRecord](./zoe-data-types.html#keywordrecord)** - Optional.
* **offerArgs**: **[CopyRecord](/glossary/#copyrecord)** - Optional.
* Returns: **Promise<[UserSeat](./user-seat.html)>**

Used to make an offer to the contract that created the **invitation**.

### Proposals [​](#proposals)

**proposal** must be either `undefined` or a record with **give**, **want**, and/or **exit** properties respectively expressing conditions regarding what is being given, what is desired in exchange (protected by offer safety), and an exit rule defining how/when the offer can be canceled. Note that the contract is not obligated to accept the proposal; it may inspect it and reject it for any reason (in which case all payments will be returned promptly).

js
```
const myProposal = harden({
  give: { Asset: AmountMath.make(quatloosBrand, 4n) },
  want: { Price: AmountMath.make(moolaBrand, 15n) },
  exit: { onDemand: null }
});
```

**give** and **want** use **[Keywords](./zoe-data-types.html#keyword)** defined by the contract. In the example above, "Asset" and "Price" are the Keywords. However, in an auction contract, the Keywords might be "Asset" and "Bid".

**exit** specifies how the offer can be cancelled. It must conform to one of three shapes:

* `{ onDemand: null }`: (Default) The offering party can cancel on demand.
* `{ waived: null }`: The offering party can't cancel and relies entirely on the smart contract to complete (finish or fail) their offer.
* `{ afterDeadline: deadlineDetails }`: The offer is automatically cancelled after a deadline, as determined by its **timer** and **deadline** properties. The proposer cannot exit the seat before the deadline (the seat is in the **waived** state), but the contract can exit the proposer's seat early. **timer** must be a timer, and **deadline** must be timestamp understood by it. (Some timers use Unix epoch time, while others count block height.) For more details, see [Timer Services](/reference/repl/timerServices.html).

A contract can avoid invalid proposals; see [Proposal Shapes](./zoe-contract-facet.html#proposal-shapes).

### Payments [​](#payments)

**paymentPKeywordRecord** must be either `undefined` or a **[PaymentPKeywordRecord](./zoe-data-types.html#keywordrecord)** containing the actual **payments** to be escrowed by Zoe. Every **Keyword** in **give** must have a corresponding **payment**.

js
```
const paymentKeywordRecord = harden({ Asset: quatloosPayment });
```
### Offer Arguments [​](#offer-arguments)

**offerArgs** is an optional CopyRecord that can be used to pass additional arguments to the **offerHandler** contract code associated with the invitation by [`zcf.makeInvitation(...)`](./zoe-contract-facet.html#zcf-makeinvitation-offerhandler-description-customdetails-proposalshape). Each contract can define the properties it supports and which are required.

E(Zoe).installBundleID(bundleId) [​](#e-zoe-installbundleid-bundleid)
---------------------------------------------------------------------

* bundleId: **BundleId**
* Returns: **Promise<Installation>**

Reserved for future use.

E(Zoe).getBundleIDFromInstallation(installation) [​](#e-zoe-getbundleidfrominstallation-installation)
-----------------------------------------------------------------------------------------------------

* **installation**: **Installation**
* Returns: **Promise<BundleId>**

Reserved for future use.

