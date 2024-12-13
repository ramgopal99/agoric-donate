

Oracle Query Contract [​](#oracle-query-contract)
=================================================

 Zoe v0.24.0. Last updated August 25, 2022. 
##### [View the code on Github](https://github.com/Agoric/agoric-sdk/blob/4c4da6a7ae76aebbff2af48613008978eb04462b/packages/zoe/src/contracts/oracle.js) (Last updated: Jan 31, 2022) [​](#view-the-code-on-github-last-updated-jan-31-2022)

##### [View all contracts on Github](https://github.com/Agoric/agoric-sdk/tree/master/packages/zoe/src/contracts) [​](#view-all-contracts-on-github)

**NOTE: You almost certainly do not want to use this contract directly. Instead, please read the [Chainlink integration documentation](/guides/chainlink-integration.html)**

This contract lets other contracts or users make single free or fee-based queries to a generic oracle node (a single instance). This provides a very low-level API to issue single queries that an individual off-chain oracle node answers.

**CAUTION: The security of oracle networks (such as Chainlink) depends upon having higher-level contracts to aggregate the results of the individual nodes (this low-level contract). This protects against misbehaviour from an individual node.**

Relying on just a single node can be both expensive and risky. Instead, use the higher-level APIs described in the [Chainlink integration documentation](/guides/chainlink-integration.html).

Making a Free Query [​](#making-a-free-query)
---------------------------------------------

To make a free query, obtain the `publicFacet` for the oracle contract instance.

js
```
const response = await E(publicFacet).query(
  'What is the answer to the Ultimate Question of Life, the Universe, and Everything?',
);
// response = 42
```

The `query` that is passed in could be in any format that the oracle accepts. The response can be in any format, as the oracle determines.

Making a Paid Query [​](#making-a-paid-query)
---------------------------------------------

To make a query that requires payment, obtain the `publicFacet` as before, but this time, make a `queryInvitation`. Use the `queryInvitation` to make an offer and escrow the required payments in the `Fee` brand. The response will be the result of your offer.

js
```
const queryInvitation = E(publicFacet).makeQueryInvitation(
  'What is *really* the answer?',
);

const proposal = harden({
  give: { Fee: link },
});

const payments = harden({
  Fee: linkPayment,
});

const querySeat = E(zoe).offer(queryInvitation, proposal, payments);

const offerResult = await E(querySeat).getOfferResult();
// offerResult = 42
```

Instantiating a New Oracle Contract [​](#instantiating-a-new-oracle-contract)
-----------------------------------------------------------------------------

If you want to create your own oracle contract instance, first bundle and install the code if it is not already installed.

js
```
const contractUrl = await importMetaResolve(
  '@agoric/zoe/src/contracts/oracle.js',
  import.meta.url,
);
const contractPath = url.fileURLToPath(contractUrl);
const contractBundle = await bundleSource(contractPath);
const installation = await E(zoe).install(contractBundle);
```

Then start the contract instance. You will receive a `publicFacet` and a `creatorFacet`.

js
```
const { creatorFacet, publicFacet } = await E(zoe).startInstance(
  installation,
  { Fee: linkIssuer },
);
```

You will need to use the creatorFacet to initialize an `oracleHandler`. The `oracleHandler` is what will actually be queried, so we do not want to put it in the contract terms, which are publicly accessible.

js
```
const initializedCreatorFacet = await E(creatorFacet).initialize({
  oracleHandler,
});
```

The Oracle Handler API [​](#the-oracle-handler-api)
---------------------------------------------------

The contract expects all `oracleHandlers` to offer the following API:

js
```
const oracleHandlerAPI = Far('oracleHandlerAPI', {
  onQuery: async (_query, _fee) => {},
  onError: async (_query, _reason) => {},
  onReply: async (_query, _reply, _fee) => {},
});
```
