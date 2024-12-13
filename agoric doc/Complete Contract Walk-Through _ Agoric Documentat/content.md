

Complete Contract Walk-Through [​](#complete-contract-walk-through)
===================================================================

Let's look at the contract from [the basic dapp](./../getting-started/) in some detail.

Bundling a Contract [​](#bundling-a-contract)
---------------------------------------------

In [deploying the basic dapp contract](./../getting-started/#starting-the-dapp-smart-contract), the first step was to *bundle* all of its modules into a single artifact. We used the [agoric run](./../agoric-cli/#agoric-run) command in that case. The core mechanism used in `agoric run` is a call to `bundleSource()`.

In the `contract` directory of the dapp, run `test-bundle-source.js` following `ava` conventions:

sh
```
cd contract
yarn ava test/test-bundle-source.js
```

The results look something like...

console
```
  ✔ bundleSource() bundles the contract for use with zoe (2.7s)
    ℹ 1e1aeca9d3ebc0bd39130fe5ef6fbb077177753563db522d6623886da9b43515816df825f7ebcb009cbe86dcaf70f93b9b8595d1a87c2ab9951ee7a32ad8e572
    ℹ Object @Alleged: BundleInstallation {}
  ─

  1 test passed
```
Test Setup

The test uses `createRequire` from the node `module` API to resolve the main module specifier:

js
```
import bundleSource from '@endo/bundle-source';
import { createRequire } from 'module';
```
js
```
const myRequire = createRequire(import.meta.url);
const contractPath = myRequire.resolve(`../src/offer-up.contract.js`);
```

`bundleSource()` returns a bundle object with `moduleFormat`, a hash, and the contents:

js
```
const bundle = await bundleSource(contractPath);
t.is(bundle.moduleFormat, 'endoZipBase64');
t.log(bundle.endoZipBase64Sha512);
t.true(bundle.endoZipBase64.length > 10_000);
```
Getting the zip file from inside a bundle

An endo bundle is a zip file inside JSON. To get it back out:

sh
```
jq -r .endoZipBase64 bundle-xyz.json | base64 -d >xyz.zip
```

You can then, for example, look at its contents:

sh
```
unzip -l xyz.zip
```

Contract Installation [​](#contract-installation)
-------------------------------------------------

To identify the code of contracts that parties consent to participate in, Zoe uses *Installation* objects.

Let's try it with the contract from our [basic dapp](./../getting-started/):

sh
```
yarn ava test/test-contract.js -m 'Install the contract'
```
```
  ✔ Install the contract
    ℹ Object @Alleged: BundleInstallation {}
```
Test Setup

The test starts by using `makeZoeKitForTest` to set up zoe for testing:

js
```
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';
```
js
```
const { zoeService: zoe } = makeZoeKitForTest();
```

It gets an installation using a bundle as in the previous section:

js
```
const installation = await E(zoe).install(bundle);
t.log(installation);
t.is(typeof installation, 'object');
```

The `installation` identifies the basic contract that we'll go over in detail in the sections below.

offer-up.contract.js listingjs
```
/** @file Contract to mint and sell a few Item NFTs at a time. */
// @ts-check

import { Far } from '@endo/far';
import { M, getCopyBagEntries } from '@endo/patterns';
import { AssetKind } from '@agoric/ertp/src/amountMath.js';
import { atomicRearrange } from '@agoric/zoe/src/contractSupport/atomicTransfer.js';
import '@agoric/zoe/exported.js';

const { Fail, quote: q } = assert;

/** @type { (xs: bigint[]) => bigint } */
const sum = xs => xs.reduce((acc, x) => acc + x, 0n);

/**
 * @param {import('@endo/patterns').CopyBag} bag
 * @returns {bigint[]}
 */
const bagCounts = bag => {
  const entries = getCopyBagEntries(bag);
  return entries.map(([_k, ct]) => ct);
};

/**
 * In addition to the standard `issuers` and `brands` terms,
 * this contract is parameterized by terms for price and,
 * optionally, a maximum number of items sold for that price (default: 3).
 *
 * @typedef {{
 *   tradePrice: Amount;
 *   maxItems?: bigint;
 * }} OfferUpTerms
 */

/** @param {ZCF<OfferUpTerms>} zcf */
export const start = async zcf => {
  const { tradePrice, maxItems = 3n } = zcf.getTerms();

  const itemMint = await zcf.makeZCFMint('Item', AssetKind.COPY_BAG);
  const { brand: itemBrand } = itemMint.getIssuerRecord();

  /** a seat for allocating proceeds of sales */
  const proceeds = zcf.makeEmptySeatKit().zcfSeat;
  /** @type {OfferHandler} */
  const tradeHandler = buyerSeat => {
    // give and want are guaranteed by Zoe to match proposalShape
    const { want } = buyerSeat.getProposal();

    sum(bagCounts(want.Items.value)) <= maxItems ||
      Fail`max ${q(maxItems)} items allowed: ${q(want.Items)}`;

    const newItems = itemMint.mintGains(want);
    atomicRearrange(
      zcf,
      harden([
        // price from buyer to proceeds
        [buyerSeat, proceeds, { Price: tradePrice }],
        // new items to buyer
        [newItems, buyerSeat, want],
      ]),
    );

    buyerSeat.exit(true);
    newItems.exit();
    return 'trade complete';
  };

  const proposalShape = harden({
    give: { Price: M.gte(tradePrice) },
    want: { Items: { brand: itemBrand, value: M.bag() } },
    exit: M.any(),
  });

  const makeTradeInvitation = () =>
    zcf.makeInvitation(tradeHandler, 'buy items', undefined, proposalShape);

  // Mark the publicFacet Far, i.e. reachable from outside the contract
  const publicFacet = Far('Items Public Facet', {
    makeTradeInvitation,
  });

  return harden({ publicFacet });
};

harden(start);
```

Starting a Contract Instance [​](#starting-a-contract-instance)
---------------------------------------------------------------

Now we're ready to start an *instance* of the [basic dapp](./../getting-started/) contract:

sh
```
yarn ava test/test-contract.js -m 'Start the contract'
```
```
  ✔ Start the contract (652ms)
    ℹ terms: {
        tradePrice: {
          brand: Object @Alleged: PlayMoney brand {},
          value: 5n,
        },
      }
    ℹ Object @Alleged: InstanceHandle {}
```

Contracts can be parameterized by *terms*. The price of joining the game is not fixed in the source code of this contract, but rather chosen when starting an instance of the contract. Likewise, when starting an instance, we can choose which asset *issuers* the contract should use for its business:

js
```
const money = makeIssuerKit('PlayMoney');
const issuers = { Price: money.issuer };
const terms = { tradePrice: AmountMath.make(money.brand, 5n) };
t.log('terms:', terms);

/** @type {ERef<Installation<GameContractFn>>} */
const installation = E(zoe).install(bundle);
const { instance } = await E(zoe).startInstance(installation, issuers, terms);
t.log(instance);
t.is(typeof instance, 'object');
```

*`makeIssuerKit` and `AmountMath.make` are covered in the [ERTP](./../ertp/) section, along with `makeEmptyPurse`, `mintPayment`, and `getAmountOf` below.*

*See also [E(zoe).startInstance(...)](/reference/zoe-api/zoe.html#e-zoe-startinstance-installation-issuerkeywordrecord-terms-privateargs).*

Let's take a look at what happens in the contract when it starts. A *facet* of Zoe, the *Zoe Contract Facet*, is passed to the contract `start` function. The contract uses this `zcf` to get its terms. Likewise it uses `zcf` to make a `proceeds` seat where it can store assets that it receives in trade as well as a `mint` for making assets consisting of collections (bags) of Items:

js
```
/** @param {ZCF<OfferUpTerms>} zcf */
export const start = async zcf => {
  const { tradePrice, maxItems = 3n } = zcf.getTerms();

  const itemMint = await zcf.makeZCFMint('Item', AssetKind.COPY_BAG);
```

It defines a `proposalShape` and `tradeHandler` but doesn't do anything with them yet. They will come into play later. It defines and returns a [hardened](/glossary/#harden) `publicFacet` object and stands by.

js
```
return harden({ publicFacet });
```

Trading with Offer Safety [​](#trading-with-offer-safety)
---------------------------------------------------------

Our [basic dapp](./../getting-started/) includes a test of trading:

sh
```
yarn ava test/test-contract.js -m 'Alice trades*'
```
```
  ✔ Alice trades: give some play money, want items (309ms)
    ℹ Object @Alleged: InstanceHandle {}
    ℹ Alice gives {
        Price: {
          brand: Object @Alleged: PlayMoney brand {},
          value: 5n,
        },
      }
    ℹ Alice payout brand Object @Alleged: Item brand {}
    ℹ Alice payout value Object @copyBag {
        payload: [
          [
            'scroll',
            1n,
          ],
          [
            'map',
            1n,
          ],
        ],
      }
```

We start by putting some money in a purse for Alice:

js
```
const alicePurse = money.issuer.makeEmptyPurse();
const amountOfMoney = AmountMath.make(money.brand, 10n);
const moneyPayment = money.mint.mintPayment(amountOfMoney);
alicePurse.deposit(moneyPayment);
```

Then we pass the contract instance and the purse to our code for `alice`:

js
```
await alice(t, zoe, instance, alicePurse);
```

Alice starts by using the `instance` to get the contract's `publicFacet` and `terms` from Zoe:

![](/assets/trade-offer-safety-1.DekSNbtq.svg)

js
```
const publicFacet = E(zoe).getPublicFacet(instance);
const terms = await E(zoe).getTerms(instance);
const { issuers, brands, tradePrice } = terms;
```

Then she constructs a *proposal* to give the `tradePrice` in exchange for 1 map and 1 scroll, denominated in the game's `Item` brand; and she withdraws a payment from her purse:

js
```
const choices = ['map', 'scroll'];
const choiceBag = makeCopyBag(choices.map(name => [name, 1n]));
const proposal = {
  give: { Price: tradePrice },
  want: { Places: AmountMath.make(brands.Item, choiceBag) },
};
const Price = await E(purse).withdraw(tradePrice);
t.log('Alice gives', proposal.give);
```

She then requests an *invitation* to join the game; makes an *offer* with (a promise for) this invitation, her proposal, and her payment; and awaits her **Items** payout:

![](/assets/trade-offer-safety-2.CfTO5byR.svg)

js
```
const toJoin = E(publicFacet).makeTradeInvitation();

const seat = E(zoe).offer(toJoin, proposal, { Price });
const items = await E(seat).getPayout('Items');
```
Troubleshooting missing brands in offers

If you see...

```
Error#1: key Object [Alleged: IST brand] {} not found in collection brandToIssuerRecord
```

then it may be that your offer uses brands that are not known to the contract. Use [E(zoe).getTerms()](/reference/zoe-api/zoe.html#e-zoe-getterms-instance) to find out what issuers are known to the contract.

If you're writing or instantiating the contract, you can tell the contract about issuers when you are [creating an instance](#starting-a-contract-instance) or by using [zcf.saveIssuer()](/reference/zoe-api/zoe-contract-facet.html#zcf-saveissuer-issuer-keyword).

The contract gets Alice's `E(publicFacet).makeTradeInvitation()` call and uses `zcf` to make an invitation with an associated handler, description, and proposal shape. Zoe gets Alice's `E(zoe).offer(...)` call, checks the proposal against the proposal shape, escrows the payment, and invokes the handler.

![](/assets/trade-offer-safety-3.CY4mkclO.svg)

js
```
const proposalShape = harden({
  give: { Price: M.gte(tradePrice) },
  want: { Items: { brand: itemBrand, value: M.bag() } },
  exit: M.any(),
});

const makeTradeInvitation = () =>
  zcf.makeInvitation(tradeHandler, 'buy items', undefined, proposalShape);

// Mark the publicFacet Far, i.e. reachable from outside the contract
const publicFacet = Far('Items Public Facet', {
  makeTradeInvitation,
});
```

The offer handler is invoked with a *seat* representing the party making the offer. It extracts the `give` and `want` from the party's offer and checks that they are giving at least the `tradePrice` and not asking for too many items in return.

With all these prerequisites met, the handler instructs `zcf` to mint the requested **Item** assets, allocate what the player is giving into its own `proceeds` seat, and allocate the minted items to the player. Finally, it concludes its business with the player.

![](/assets/trade-offer-safety-4.DMWTHTn6.svg)

js
```
/** @type {OfferHandler} */
const tradeHandler = buyerSeat => {
  // give and want are guaranteed by Zoe to match proposalShape
  const { want } = buyerSeat.getProposal();

  sum(bagCounts(want.Items.value)) <= maxItems ||
    Fail`max ${q(maxItems)} items allowed: ${q(want.Items)}`;

  const newItems = itemMint.mintGains(want);
  atomicRearrange(
    zcf,
    harden([
      // price from buyer to proceeds
      [buyerSeat, proceeds, { Price: tradePrice }],
      // new items to buyer
      [newItems, buyerSeat, want],
    ]),
  );

  buyerSeat.exit(true);
  newItems.exit();
  return 'trade complete';
};
```

Zoe checks that the contract's instructions are consistent with the offer and with conservation of assets. Then it allocates the escrowed payment to the contract's proceeds seat and pays out the place NFTs to Alice in response to the earlier `getPayout(...)` call.

Alice asks the `Item` issuer what her payout is worth and tests that it's what she wanted.

![](/assets/trade-offer-safety-5.DcuKv0tJ.svg)

js
```
const actual = await E(issuers.Item).getAmountOf(items);
t.log('Alice payout brand', actual.brand);
t.log('Alice payout value', actual.value);
t.deepEqual(actual, proposal.want.Items);
```
