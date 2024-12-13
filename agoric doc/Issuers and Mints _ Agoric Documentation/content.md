

Issuers and Mints [​](#issuers-and-mints)
=========================================

Issuers [​](#issuers)
---------------------

![Issuer structure](/assets/issuers-and-assets.JGzS9WVG.svg)

**Note**: You should not create an Issuer in a deploy script. Deploy scripts are ephemeral, so any object created there dies as soon as the script stops.

Behind the scenes, an `issuer` maps minted digital assets to their location in a `purse` or `payment`. An `issuer` verifies, moves, and manipulates digital assets. Its special admin facet is a `mint` which it has a one-to-one relationship with. Only a `mint` can issue new digital assets; an `issuer` cannot.

An `issuer` also has a one-to-one relationship with a `brand`. So, if our `brand` is the imaginary currency Quatloos, only the `issuer` in the one-to-one relationship with the Quatloos `brand` can:

* Create a new empty `purse` that can store Quatloos.
* Manipulate a `payment` in Quatloos to be claimed, split, combined, burned, or have its amount received.

An `issuer` should be obtained from a trusted source and then relied upon as the authority as to whether an untrusted `payment` of the same `brand` is valid.

![Issuer methods](/assets/issuer1.C9gq6Vcc.svg)

`Issuer` methods:

* Return information about an `issuer`.
* Create a new `issuer`.
* Create a new `purse`.
* Operate on `payment` arguments.

The following is a brief description and example of each `Issuer` method. For more detail, click the method's name to go to its entry in the [ERTP API Reference](/reference/ertp-api/).

* **Create issuer operation**
  + [makeIssuerKit()](/reference/ertp-api/issuer.html#makeissuerkit-allegedname-assetkind-displayinfo-optshutdownwithfailure-elementshape)
    - Create and return a new `issuer` and its associated `mint` and `brand`.
    - js
      ```
      /* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
      import { test } from '../../prepare-test-env-ava.js';
      
      import { AmountMath, makeIssuerKit, AssetKind } from '@agoric/ertp';
      
      // TODO `claim`,`combine`, `split`, and `splitMany' are deprecated.
      // Stop documenting, importing, and testing them.
      import {
        claim,
        combine,
        split,
        splitMany,
      } from '@agoric/ertp/src/legacy-payment-helpers.js';
      
      test('ertp guide issuers and mints makeIssuerKit', async t => {
        // #region makeIssuerKit
        const {
          issuer: quatloosIssuer,
          mint: quatloosMint,
          brand: quatloosBrand,
        } = makeIssuerKit('quatloos');
        // This is merely an amount, describing assets.
        // It does not create new assets.
        const quatloos2 = AmountMath.make(quatloosBrand, 2n);
        // Non-fungible asset, which needs an AssetKind
        // of AssetKind.SET
        const { mint: titleMint, issuer: titleIssuer } = makeIssuerKit(
          'alamedaCountyPropertyTitle',
          AssetKind.SET,
        );
        // #endregion makeIssuerKit
      
        t.truthy(quatloosIssuer);
        t.truthy(quatloosMint);
        t.truthy(quatloosBrand);
        t.deepEqual(quatloos2, { brand: quatloosBrand, value: 2n });
        t.truthy(titleMint);
        t.truthy(titleIssuer);
      });
      
      test('ertp guide issuers and mints getBrand', async t => {
        // #region getBrand
        const { issuer: quatloosIssuer, brand: quatloosBrand } =
          makeIssuerKit('quatloos');
        // myQuatloosBrand === quatloosBrand
        const myQuatloosBrand = quatloosIssuer.getBrand();
        // #endregion getBrand
      
        t.is(quatloosBrand, myQuatloosBrand);
      });
      
      test('ertp guide issuers and mints getAllegedName', async t => {
        // #region getAllegedName
        const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
        const quatloosIssuerAllegedName = quatloosIssuer.getAllegedName();
        // quatloosIssuerAllegedName === 'quatloos'
        // #endregion getAllegedName
        t.is(quatloosIssuerAllegedName, 'quatloos');
      });
      
      test('ertp guide issuers and mints getAssetKind', async t => {
        // #region getAssetKind
        const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
        const kind = quatloosIssuer.getAssetKind(); // 'nat', the default value for makeIssuerKit()
        // #endregion getAssetKind
        t.is(kind, 'nat');
      });
      
      test('ertp guide issuers and mints makeEmptyPurse', async t => {
        // #region makeEmptyPurse
        const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
        // The new empty purse contains 0 Quatloos
        const quatloosPurse = quatloosIssuer.makeEmptyPurse();
        // #endregion makeEmptyPurse
        t.deepEqual(await quatloosPurse.getCurrentAmount(), {
          brand: quatloosIssuer.getBrand(),
          value: 0n,
        });
      });
      
      test('ertp guide issuers and mints payment methods', async t => {
        const {
          issuer: quatloosIssuer,
          brand: quatloosBrand,
          mint: quatloosMint,
        } = makeIssuerKit('quatloos');
      
        const recoveryPurse = quatloosIssuer.makeEmptyPurse();
      
        // #region getAmountOf
        const quatloosPayment = quatloosMint.mintPayment(
          AmountMath.make(quatloosBrand, 100n),
        );
        // returns an amount with a value of 100 and the quatloos brand
        quatloosIssuer.getAmountOf(quatloosPayment);
        // #endregion getAmountOf
      
        // #region burn
        const amountToBurn = AmountMath.make(quatloosBrand, 10n);
        const paymentToBurn = quatloosMint.mintPayment(amountToBurn);
        // burntAmount is 10 quatloos
        const burntAmount = await quatloosIssuer.burn(paymentToBurn, amountToBurn);
        // #endregion burn
        t.deepEqual(burntAmount, amountToBurn);
      
        // #region claim
        const amountToTransfer = AmountMath.make(quatloosBrand, 2n);
        const originalPayment = quatloosMint.mintPayment(amountToTransfer);
        const newPayment = await claim(
          recoveryPurse,
          originalPayment,
          amountToTransfer,
        );
        // #endregion claim
        t.deepEqual(await quatloosIssuer.getAmountOf(newPayment), amountToTransfer);
        t.not(originalPayment, newPayment);
      
        // #region combine
        // create an array of 100 payments of 1 unit each
        const payments = [];
        for (let i = 0; i < 100; i += 1) {
          payments.push(quatloosMint.mintPayment(AmountMath.make(quatloosBrand, 1n)));
        }
        // combinedPayment equals 100
        const combinedPayment = combine(recoveryPurse, harden(payments));
        // #endregion combine
      
        t.deepEqual(await quatloosIssuer.getAmountOf(combinedPayment), {
          brand: quatloosBrand,
          value: 100n,
        });
      
        // #region split
        const oldPayment = quatloosMint.mintPayment(
          AmountMath.make(quatloosBrand, 30n),
        );
        const [paymentA, paymentB] = await split(
          recoveryPurse,
          oldPayment,
          AmountMath.make(quatloosBrand, 10n),
        );
        // paymentA is 10 quatloos, payment B is 20 quatloos.
        // #endregion split
        const paymentAAmount = await quatloosIssuer.getAmountOf(paymentA);
        const paymentBAmount = await quatloosIssuer.getAmountOf(paymentB);
        t.deepEqual(paymentAAmount, AmountMath.make(quatloosBrand, 10n));
        t.deepEqual(paymentBAmount, AmountMath.make(quatloosBrand, 20n));
      
        // #region splitMany
        // #region splitManyConcise
        const oldQuatloosPayment = quatloosMint.mintPayment(
          AmountMath.make(quatloosBrand, 100n),
        );
        const goodQuatloosAmounts = Array(10).fill(
          AmountMath.make(quatloosBrand, 10n),
        );
      
        const arrayOfNewPayments = await splitMany(
          recoveryPurse,
          oldQuatloosPayment,
          harden(goodQuatloosAmounts),
        );
        // #endregion splitManyConcise
        // Note that the total amount in the amountArray must equal the
        // amount in the original payment, in the above case, 100 Quatloos in each.
      
        const anotherQuatloosPayment = quatloosMint.mintPayment(
          AmountMath.make(quatloosBrand, 1000n),
        );
        // total amounts in badQuatloosAmounts equal 20, when it should equal 1000
        const badQuatloosAmounts = Array(2).fill(AmountMath.make(quatloosBrand, 10n));
        // throws error
        await t.throwsAsync(
          () =>
            splitMany(
              recoveryPurse,
              anotherQuatloosPayment,
              harden(badQuatloosAmounts),
            ),
          { message: /rights were not conserved/ },
        );
        // #endregion splitMany
      
        t.is(arrayOfNewPayments.length, 10);
        t.deepEqual(await quatloosIssuer.getAmountOf(arrayOfNewPayments[0]), {
          value: 10n,
          brand: quatloosBrand,
        });
      
        const payment = quatloosMint.mintPayment(
          AmountMath.make(quatloosBrand, 100n),
        );
        // #region isLive
        const isItLive = quatloosIssuer.isLive(payment);
        // #endregion isLive
        t.truthy(isItLive);
      
        // #region getIssuer
        const quatloosMintIssuer = quatloosMint.getIssuer();
        // returns true
        const sameIssuer = quatloosIssuer === quatloosMintIssuer;
        // #endregion
      
        t.truthy(sameIssuer);
      
        // #region isMyIssuer
        const isIssuer = quatloosBrand.isMyIssuer(quatloosIssuer);
        // #endregion isMyIssuer
      
        t.truthy(isIssuer);
      });
      
      test('ertp guide issuers and mints mint.getIssuer', async t => {
        // #region mintGetIssuer
        const { issuer: quatloosIssuer, mint: quatloosMint } =
          makeIssuerKit('quatloos');
        const quatloosMintIssuer = quatloosMint.getIssuer();
        // returns true
        const sameIssuer = quatloosIssuer === quatloosMintIssuer;
        // #endregion mintGetIssuer
        t.truthy(sameIssuer);
      });
      
      test('ertp guide issuers and mints mint.mintPayment', async t => {
        // #region mintMintPayment
        const { mint: quatloosMint, brand: quatloosBrand } =
          makeIssuerKit('quatloos');
        const quatloos1000 = AmountMath.make(quatloosBrand, 1000n);
        const newPayment = quatloosMint.mintPayment(quatloos1000);
        // #endregion mintMintPayment
      
        const issuer = quatloosMint.getIssuer();
        t.truthy(issuer.isLive(newPayment));
      });
      
      test('ertp guide mints makeIssuerKit', async t => {
        // #region makeIssuerKitMint
        const {
          issuer: quatloosIssuer,
          mint: quatloosMint,
          brand: quatloosBrand,
        } = makeIssuerKit('quatloos');
        // Mint a new 2 Quatloos payment
        const paymentQuatloos2 = quatloosMint.mintPayment(
          AmountMath.make(quatloosBrand, 2n),
        );
        // #endregion makeIssuerKitMint
        t.truthy(quatloosIssuer.isLive(paymentQuatloos2));
        t.truthy(quatloosIssuer);
        t.truthy(quatloosMint);
        t.truthy(quatloosBrand);
      });
      ```
      js
      ```
      const {
        issuer: quatloosIssuer,
        mint: quatloosMint,
        brand: quatloosBrand,
      } = makeIssuerKit('quatloos');
      // This is merely an amount, describing assets.
      // It does not create new assets.
      const quatloos2 = AmountMath.make(quatloosBrand, 2n);
      // Non-fungible asset, which needs an AssetKind
      // of AssetKind.SET
      const { mint: titleMint, issuer: titleIssuer } = makeIssuerKit(
        'alamedaCountyPropertyTitle',
        AssetKind.SET,
      );
      ```
* **Get information about the issuer operations**
  + [anIssuer.getAllegedName()](/reference/ertp-api/issuer.html#anissuer-getallegedname)
    - Return the `allegedName` for the `issuer` (the non-trusted human-readable name of its associated `brand`).
    - js
      ```
      const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
      const quatloosIssuerAllegedName = quatloosIssuer.getAllegedName();
      // quatloosIssuerAllegedName === 'quatloos'
      ```
  + [anIssuer.getAssetKind()](/reference/ertp-api/issuer.html#anissuer-getassetkind)
    - Return the kind of the `issuer`'s asset; either `AssetKind.NAT` ("nat") or `AssetKind.SET` ("set").
    - js
      ```
      const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
      const kind = quatloosIssuer.getAssetKind(); // 'nat', the default value for makeIssuerKit()
      ```
  + [anIssuer.getBrand()](/reference/ertp-api/issuer.html#anissuer-getbrand)
    - Return the `brand` for the `issuer`.
    - js
      ```
      const { issuer: quatloosIssuer, brand: quatloosBrand } =
        makeIssuerKit('quatloos');
      // myQuatloosBrand === quatloosBrand
      const myQuatloosBrand = quatloosIssuer.getBrand();
      ```
* **Purse operation**
  + [anIssuer.makeEmptyPurse()](/reference/ertp-api/issuer.html#anissuer-makeemptypurse)
    - Make and return an empty `purse` for holding assets of the `brand` associated with the `issuer`.
    - js
      ```
      const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
      // The new empty purse contains 0 Quatloos
      const quatloosPurse = quatloosIssuer.makeEmptyPurse();
      ```
* **Payment operations**
  + [anIssuer.burn(payment, optAmount)](/reference/ertp-api/issuer.html#anissuer-burn-payment-optamount)
    - Destroy all of the digital assets in the `payment`.
    - js
      ```
      const amountToBurn = AmountMath.make(quatloosBrand, 10n);
      const paymentToBurn = quatloosMint.mintPayment(amountToBurn);
      // burntAmount is 10 quatloos
      const burntAmount = await quatloosIssuer.burn(paymentToBurn, amountToBurn);
      ```
  + [anIssuer.getAmountOf(payment)](/reference/ertp-api/issuer.html#anissuer-getamountof-payment)
    - Describe the `payment`'s balance as an Amount.
    - js
      ```
      const quatloosPayment = quatloosMint.mintPayment(
        AmountMath.make(quatloosBrand, 100n),
      );
      // returns an amount with a value of 100 and the quatloos brand
      quatloosIssuer.getAmountOf(quatloosPayment);
      ```
  + [anIssuer.isLive(payment)](/reference/ertp-api/issuer.html#anissuer-islive-payment) - Return `true` if the `payment` was created by the issuer and is available for use (has not been consumed or burned). - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#isLive
    
    DEPRECATED
  + [anIssuer.split(payment, paymentAmountA)](/reference/ertp-api/issuer.html#anissuer-split-payment-paymentamounta)
    - Split a single `payment` into two new Payments.
    - js
      ```
      const oldPayment = quatloosMint.mintPayment(
        AmountMath.make(quatloosBrand, 30n),
      );
      const [paymentA, paymentB] = await split(
        recoveryPurse,
        oldPayment,
        AmountMath.make(quatloosBrand, 10n),
      );
      // paymentA is 10 quatloos, payment B is 20 quatloos.
      ```
  + [anIssuer.splitMany(payment, paymentAmountArray)](/reference/ertp-api/issuer.html#anissuer-splitmany-payment-amountarray)
    - Split a single `payment` into multiple Payments.
    - js
      ```
      const oldQuatloosPayment = quatloosMint.mintPayment(
        AmountMath.make(quatloosBrand, 100n),
      );
      const goodQuatloosAmounts = Array(10).fill(
        AmountMath.make(quatloosBrand, 10n),
      );
      
      const arrayOfNewPayments = await splitMany(
        recoveryPurse,
        oldQuatloosPayment,
        harden(goodQuatloosAmounts),
      );
      // Note that the total amount in the amountArray must equal the
      // amount in the original payment, in the above case, 100 Quatloos in each.
      
      const anotherQuatloosPayment = quatloosMint.mintPayment(
        AmountMath.make(quatloosBrand, 1000n),
      );
      // total amounts in badQuatloosAmounts equal 20, when it should equal 1000
      const badQuatloosAmounts = Array(2).fill(AmountMath.make(quatloosBrand, 10n));
      // throws error
      await t.throwsAsync(
        () =>
          splitMany(
            recoveryPurse,
            anotherQuatloosPayment,
            harden(badQuatloosAmounts),
          ),
        { message: /rights were not conserved/ },
      );
      ```
* [anIssuer.claim(payment, optAmount)](/reference/ertp-api/issuer.html#anissuer-claim-payment-optamount) - Transfer all digital assets from `payment` to a new Payment. - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#claim
  + [anIssuer.combine(paymentsArray)](/reference/ertp-api/issuer.html#anissuer-combine-paymentsarray-opttotalamount) - Combine multiple Payments into one new Payment. - <<< @/../snippets/ertp/guide/test-issuers-and-mints.js#combine :::

**Related Methods:**

**Note**: These methods help you find the right `issuer`, but aren't authoritative. A `mint`, `brand`, or `purse` is actually associated with an `issuer` only if the `issuer` itself acknowledges the association.

* [aMint.getIssuer()](/reference/ertp-api/mint.html#amint-getissuer)
  + Return the `issuer` uniquely associated with the `mint`.
  + js
    ```
    const { issuer: quatloosIssuer, mint: quatloosMint } =
      makeIssuerKit('quatloos');
    const quatloosMintIssuer = quatloosMint.getIssuer();
    // returns true
    const sameIssuer = quatloosIssuer === quatloosMintIssuer;
    ```
* [aBrand.isMyIssuer(issuer)](/reference/ertp-api/brand.html#abrand-ismyissuer-allegedissuer)
  + Return `true` if `issuer` is the brand's `issuer`, `false` if not.
  + js
    ```
    const isIssuer = quatloosBrand.isMyIssuer(quatloosIssuer);
    ```

Mints [​](#mints)
-----------------

![Mint methods](/assets/mint.BUUvsM5d.svg)

A `mint` issues new digital assets of its associated `brand` as a new `payment` object. These assets may be currency-like (our imaginary Quatloos currency), goods-like valuables (magic swords for games), or electronic rights (the right to participate in a contract). Only a holder of a `mint` object can create new assets from it.

In other words, let's say there are 1000 Quatloos in circulation. Only holders of the Quatloos associated `mint` can make any more Quatloos that'd boost the amount in circulation to, say, 2000.

Since these relationships are one-to-one and unchangeable:

* A `mint` created to make an asset `brand`, say Quatloos, can only create that `brand` asset. For example, only Quatloos, not Moola or anything else.
* A `mint` that creates an asset `brand` is the only `mint` that can create that `brand`. Only the one Quatloos `mint` can create new Quatloos.
* A `mint` that creates an asset `brand` can never be changed to create a different `brand`. So a Quatloos `mint` can never become a Moola `mint`, or any other non-Quatloos asset.

There are two `mint` methods, and the method that creates new mints. Click the method's name to go to its entry in the [ERTP API Reference](/reference/ertp-api/index.html).

* [aMint.getIssuer()](/reference/ertp-api/mint.html#amint-getissuer)
  + Return the `issuer` uniquely associated with the `mint`.
  + js
    ```
    const { issuer: quatloosIssuer, mint: quatloosMint } =
      makeIssuerKit('quatloos');
    const quatloosMintIssuer = quatloosMint.getIssuer();
    // returns true
    const sameIssuer = quatloosIssuer === quatloosMintIssuer;
    ```
* [aMint.mintPayment()](/reference/ertp-api/mint.html#amint-mintpayment-newamount)
  + Create new digital assets of the `mint`'s associated `brand`.
  + js
    ```
    const { mint: quatloosMint, brand: quatloosBrand } =
      makeIssuerKit('quatloos');
    const quatloos1000 = AmountMath.make(quatloosBrand, 1000n);
    const newPayment = quatloosMint.mintPayment(quatloos1000);
    ```
* [makeIssuerKit()](/reference/ertp-api/issuer.html#makeissuerkit-allegedname-assetkind-displayinfo-optshutdownwithfailure-elementshape)
  + Create and return a new `issuer` and its associated `mint` and `brand`.
  + js
    ```
    const {
      issuer: quatloosIssuer,
      mint: quatloosMint,
      brand: quatloosBrand,
    } = makeIssuerKit('quatloos');
    // Mint a new 2 Quatloos payment
    const paymentQuatloos2 = quatloosMint.mintPayment(
      AmountMath.make(quatloosBrand, 2n),
    );
    ```
