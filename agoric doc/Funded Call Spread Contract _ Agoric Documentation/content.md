

Funded Call Spread Contract [​](#funded-call-spread-contract)
=============================================================

 Zoe v0.24.0. Last updated August 25, 2022. 
##### [View the code on Github](https://github.com/Agoric/agoric-sdk/blob/4e0aece631d8310c7ab8ef3f46fad8981f64d208/packages/zoe/src/contracts/callSpread/fundedCallSpread.js) (Last updated: Feb 20, 2022) [​](#view-the-code-on-github-last-updated-feb-20-2022)

##### [View all contracts on Github](https://github.com/Agoric/agoric-sdk/tree/master/packages/zoe/src/contracts) [​](#view-all-contracts-on-github)

This contract implements a fully collateralized call spread. You can use a call spread as a [financial building block](https://youtu.be/m5Pf2d1tHCs) to create futures, puts, calls, and event binaries that would form the basis for a prediction market, insurance, and much more. A call spread is a combination of a call option bought at one strike price and a second call option sold at a higher price. A call spread has two participating seats that pay out complementary amounts depending on the value of some good at a known future time. This video gives a [walkthrough of the implementation](https://youtu.be/m5Pf2d1tHCs?t=3566) of the contract.

There are two variants of the callSpread. This one is fully funded by its creator, who can then sell (or transfer another way) the options to other parties. The other is called the [pricedCallSpread](./pricedCallSpread.html). It allows the creator to specify the proportion of the collateral that should be provided by the two parties. Each get an invitation to contribute a stated amount of collateral for a particular position.

These options are settled financially. There is no requirement that the original purchaser have ownership of the underlying asset at the start, and the beneficiaries shouldn't expect to take delivery at closing.

Issuers [​](#issuers)
---------------------

The Strike and Collateral currencies are often the same, however these contracts decouple the currencies. You can have, for example, a spread based on APPL stock (`Underlying`), with the stock price in USD (`Strike`) where the contract pays out in JPY (`Collateral`).

The issuerKeywordRecord specifies issuers for three keywords: Underlying, Strike, and Collateral.

* The asset whose eventual value determines the payouts uses `Underlying`. This is often a fungible currency, but doesn't have to be. It would be perfectly valid to have a call spread contract on the value of a "Superior Magic Sword", as long as there was a price oracle to determine its price at the expiration time.
* The original deposit and the payout use the `Collateral` issuer.
* `Strike` amounts are used for the price oracle's quote as to the value of the Underlying, as well as the strike prices in the terms.

Terms [​](#terms)
-----------------

The terms include `{ timer, underlyingAmount, expiration, priceAuthority, strikePrice1, strikePrice2, settlementAmount }`.

* `timer` is a [timer](/reference/repl/timerServices.html), and must be recognized by `priceAuthority`.
* `expiration` is a time recognized by the `timer`.
* `underlyingAmount` is passed to `priceAuthority`. It could be an NFT or a fungible amount.
* `strikePrice2` must be greater than `strikePrice1`.
* `settlementAmount` is the amount deposited by the creator and split between the holders of the options. It uses Collateral.
* `priceAuthority` is an oracle that has a timer so it can respond to requests for prices as of a stated time. After the deadline, it will issue a PriceQuote giving the value of the underlying asset in the strike currency.

js
```
// underlying is 2 Simoleans, strike range is 30-50 (doubled)
const terms = harden({
  expiration: 3n,
  underlyingAmount: simoleans(2n),
  priceAuthority,
  strikePrice1: moola(60n),
  strikePrice2: moola(100n),
  settlementAmount: bucks(300n),
  timer: manualTimer,
});
const issuerKeywordRecord = harden({
  Underlying: simoleanIssuer,
  Collateral: bucksIssuer,
  Strike: moolaIssuer,
});

const { creatorInvitation } = await E(zoe).startInstance(
  installation,
  issuerKeywordRecord,
  terms,
);
```

Creating the Options [​](#creating-the-options)
-----------------------------------------------

The terms specify all the details of the options. However, the options are not handed out until the creator provides the collateral that will make them valuable. The creatorInvitation has customProperties including the amounts of the two options: `longAmount` and `shortAmount`.

js
```
const invitationDetails =
  await E(zoe).getInvitationDetails(creatorInvitation);
const { customDetails } = invitationDetails;
assert(typeof customDetails === 'object');

const longOptionAmount = customDetails.longAmount;
const shortOptionAmount = customDetails.shortAmount;
```

The creator uses these option amounts to create an offer that ensures that they will get the two options in exchange for the funds. The proposal describes the desired options and provided collateral. When the offer is made, a payout is returned containing the two option positions. The positions are invitations which can be exercised for free, and provide the option payouts under the keyword `Collateral`.

js
```
const aliceProposal = harden({
  want: { LongOption: longOptionAmount, ShortOption: shortOptionAmount },
  give: { Collateral: bucks(300n) },
});
const alicePayments = { Collateral: aliceBucksPayment };
const aliceSeat = await E(zoe).offer(
  creatorInvitation,
  aliceProposal,
  alicePayments,
);
const { LongOption: bobLongOption, ShortOption: carolShortOption } =
  await aliceSeat.getPayouts();
```

Validating the Options [​](#validating-the-options)
---------------------------------------------------

The options returned by the contract are Zoe invitations, so their values and terms can be verified by asking for the contract terms. This makes it possible to sell the options because a prospective purchaser will be able to inspect the value. The prospective purchaser can see that the priceAuthority is one they are willing to rely on and can verify the underlying amount. They can check that the expiration matches their expectations (here `3n` is a small integer suitable for a manual timer in a test; in actual use, it might represent block height or wall clock time.) The strike prices and settlement amount are likewise visible.

js
```
const shortDetails = shortOptionAmount.value[0];
const { customDetails: shortCustomDetails } = shortDetails;
assert(typeof shortCustomDetails === 'object');

const carolTerms = await E(zoe).getTerms(shortDetails.instance);
t.is('short', shortCustomDetails.position);
t.is(3n, carolTerms.expiration);
t.is(manualTimer, carolTerms.timer);
t.is(priceAuthority, carolTerms.priceAuthority);
t.truthy(AmountMath.isEqual(simoleans(2n), carolTerms.underlyingAmount));
t.truthy(AmountMath.isEqual(moola(60n), carolTerms.strikePrice1));
t.truthy(AmountMath.isEqual(moola(100n), carolTerms.strikePrice2));
t.truthy(AmountMath.isEqual(bucks(300n), carolTerms.settlementAmount));
```

Options can be Exercised Independently [​](#options-can-be-exercised-independently)
-----------------------------------------------------------------------------------

The contract doesn't rely on the options being exercised before the specified close. If either option is exercised after the closing price is determined, the payouts will still be available. The two options make their payment available as soon after exercise as the price is available, and neither waits for the other to exercise.

js
```
const bobOptionSeat = await E(zoe).offer(bobLongOption);
const bobPayout = bobOptionSeat.getPayout('Collateral');
```

There is a [unit test](https://github.com/Agoric/agoric-sdk/blob/0b44d486390768fbf828e64ce52c99192f67ada0/packages/zoe/test/unitTests/contracts/test-callSpread.js#L440) showing how you could offer these options for sale using the SimpleExchange contract.

