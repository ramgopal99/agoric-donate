

Priced Call Spread Contract [​](#priced-call-spread-contract)
=============================================================

 Zoe v0.24.0. Last updated August 25, 2022. 
##### [View the code on Github](https://github.com/Agoric/agoric-sdk/blob/4e0aece631d8310c7ab8ef3f46fad8981f64d208/packages/zoe/src/contracts/callSpread/pricedCallSpread.js) (Last updated: Feb 20, 2022) [​](#view-the-code-on-github-last-updated-feb-20-2022)

##### [View all contracts on Github](https://github.com/Agoric/agoric-sdk/tree/master/packages/zoe/src/contracts) [​](#view-all-contracts-on-github)

This contract implements a fully collateralized call spread. You can use a call spread as a [financial building block](https://youtu.be/m5Pf2d1tHCs) to create futures, puts, calls, and event binaries that would form the basis for a prediction market, insurance, and much more. A call spread is a combination of a call option bought at one strike price and a second call option sold at a higher price. A call spread has two participating seats that pay out complementary amounts depending on the value of some good at a known future time. This video gives a [walkthrough of the implementation](https://youtu.be/m5Pf2d1tHCs?t=3566) of the contract.

There are two variants of the callSpread. In this version, the creator requests a pair of invitations, each of which enables the holder to obtain one of the positions by providing a started portion of the collateral. The other is called the [fundedCallSpread](./fundedCallSpread.html). It is fully funded by its creator, who can then sell (or otherwise transfer) the options to other parties. The Zoe invitations representing options are produced in pairs. The individual options are Zoe invitations whose details are inspectable by prospective purchasers.

These options are settled financially. There is no requirement that the original purchaser have ownership of the underlying asset at the start, and the beneficiaries shouldn't expect to take delivery at closing.

Issuers [​](#issuers)
---------------------

The Strike and Collateral currencies are often the same, however these contracts decouple the currencies. You can have, for example, a spread based on APPL stock (`Underlying`), with the stock price in USD (`Strike`) and contract paying out in JPY (`Collateral`).

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
// Alice creates a pricedCallSpread instance
const issuerKeywordRecord = harden({
  Underlying: simoleanIssuer,
  Collateral: bucksIssuer,
  Strike: moolaIssuer,
});
const { creatorFacet } = await E(zoe).startInstance(
  installation,
  issuerKeywordRecord,
  terms,
);
```

Creating the Option Invitations [​](#creating-the-option-invitations)
---------------------------------------------------------------------

The terms specify all the details of the options. A call to `creatorFacet.makeInvitationPair()` is required to specify the share (as a whole number percentage in BigInt form) that will be contributed for the long position. It returns a pair of invitations.

js
```
const invitationPair = await E(creatorFacet).makeInvitationPair(75n);
const { longInvitation, shortInvitation } = invitationPair;
```

The creator gives these invitations to the two parties (or might retain one for their own use.) When Bob receives an invitation, he can extract the value of the call spread option that he wants, and create a proposal. The collateral required is also in the option's details. The holders of the invitations can exercise with the required collateral to receive the actual call spread option positions.

js
```
const bobProposal = harden({
  want: { Option: longOption },
  give: { Collateral: bucks(longCustomDetails.collateral) },
});
const bobFundingSeat = await E(zoe).offer(await longInvitation, bobProposal, {
  Collateral: bobBucksPayment,
});
const bobOption = await bobFundingSeat.getPayout('Option');
```

Validating the Options [​](#validating-the-options)
---------------------------------------------------

The options are packaged as invitations so they are fully self-describing, and can be verified with Zoe, so their value is apparent to anyone who might be interested in them.

js
```
const invitationIssuer = await E(zoe).getInvitationIssuer();
const longAmount = await E(invitationIssuer).getAmountOf(longInvitation);
const longDetails = longAmount.value[0];
const { customDetails: longCustomDetails } = longDetails;
assert(typeof longCustomDetails === 'object');

const longOption = longCustomDetails.option;

t.is(installation, longDetails.installation);
t.is('long', longCustomDetails.position);
t.is(225n, longCustomDetails.collateral);
```

The details of the underlying call spread option are accessible from the terms associated with this instance of the contract.

js
```
const bobTerms = await E(zoe).getTerms(longDetails.instance);
t.truthy(AmountMath.isEqual(simoleans(2n), bobTerms.underlyingAmount));
t.truthy(AmountMath.isEqual(bucks(300n), bobTerms.settlementAmount));
```

Options can be Exercised Independently [​](#options-can-be-exercised-independently)
-----------------------------------------------------------------------------------

The option position invitations can be exercised for free, and provide their payouts under the keyword `Collateral`.

js
```
const bobOptionSeat = await E(zoe).offer(bobLongOption);
const bobPayout = bobOptionSeat.getPayout('Collateral');
```

The contract doesn't rely on the options being exercised before the specified close. If either option is exercised after the closing price is determined, the payouts will still be available. The two options make their payment available as soon after exercise as the price is available, and neither waits for the other to exercise.

