

Purses and Payments [​](#purses-and-payments)
=============================================

There are different kinds of digital assets:

* Currency-like, such as our imaginary Quatloos.
* Goods-like, such as theater tickets or magic weapons for use in a game.
* Abstract rights, such as participation in a particular contract.

In ERTP, digital assets always exist in either a **purse** or a **payment** object.

* **purse**: Holds an amount of same-branded digital assets until part or all of them are withdrawn into a payment. A new purse is created by an issuer and can only hold assets of that issuer's brand.
* **payment**: Holds a quantity of same-branded digital assets to transfer to another party. A payment is created containing either new assets from a mint or existing assets withdrawn from a purse or transferred from one or more other consumed payments. It can only hold assets of the same brand as its source(s).

Any number of `purses` or `payments` can hold assets of any particular `brand`. Neither a `purse` nor a `payment` can ever change their associated `brand`.

Each `purse` and `payment` object contains a specific amount of digital assets, which may be none at all ("empty" in [AmountMath](./amount-math.html) terms). In the same way you might have separate bank accounts for different purposes, you can have separate purses for the same `brand` of digital asset. One of your purses might hold 2 Quatloos while another holds 9000 Quatloos.

When you deposit assets into a `purse`, they are added to whatever assets already exist there. So a 3 Quatloos deposit into a `purse` with 8 Quatloos results in a `purse` with 11 Quatloos.

When adding a `payment` to a `purse`, you must add the entire `payment`. To only add part of a `payment`, you must first call [anIssuer.split()](/reference/ertp-api/issuer.html#anissuer-split-payment-paymentamounta) or [anIssuer.splitMany()](/reference/ertp-api/issuer.html#anissuer-splitmany-payment-amountarray) to split it into two or more new `payments`.

`mints` create entirely new digital assets and put them in a new `payment`. You also create a `payment` by withdrawing assets from a `purse`, by splitting an existing `payment`, or by combining multiple `payments` into one new one. Note the `brand` of the new `payment` is the same as the associated `brand` of its originating `mint`, `purse`, or `payment`.

In ERTP, assets are not transferred directly from one `purse` to another. Instead, the transfer must be mediated by a `payment` as demonstrated below. In the Agoric stack, the actual send and receive operations are provided by [`E()`](./../js-programming/eventual-send.html).

* Sender:
  1. Withdraw assets described by an `amount` from a `purse`, creating a `payment`.
  2. Send this `payment` to a recipient.
* Recipient:
  1. If you don't already have one, create a `purse` for the asset `brand` you'll receive.
  2. Receive the message with the `payment`.
  3. Deposit the `payment` into a `brand`-appropriate `purse`.

Purses [​](#purses)
-------------------

You change a purse's balance by calling either `deposit()` (to add assets) or `withdraw()` (to remove assets) on it. A purse can be empty, which for fungible assets means it has a value of 0. For non-fungible assets, such as theater tickets, it doesn't have any tickets.

Unlike `payments`, `purses` are not meant to be sent to others. To transfer digital assets, you should withdraw a `payment` from a `purse` and send the `payment` to another party.

You can create a [deposit facet](/glossary/#deposit-facet) for a `purse`. Deposit facets are either sent to other parties or made publicly known. Any party can deposit a `payment` into the deposit facet, which deposits it into its associated `purse`. However, no one can use a deposit facet to either make a withdrawal from its `purse` or get the `purse`'s balance.

If you have a deposit facet, you make a deposit to its associated `purse` by calling `depositFacet.receive(payment)`. Note that you add a `payment` to a `purse` with a `deposit()` method, while you add a `payment` to a `depositFacet` with a `receive()` method.

The `payment`'s `brand` must match that of the `purse`. Otherwise it throws an error. When sending a deposit facet object to a party, you should tell them what `brand` it accepts.

![Purse methods](/assets/purse.0v19tjkj.svg)

The following is a brief description and example of each `purse` method. For more detail, click the method's name to go to its entry in the [ERTP API Reference](/reference/ertp-api/).

* [aPurse.getCurrentAmount()](/reference/ertp-api/purse.html#apurse-getcurrentamount)
  + Describe the `purse`'s current balance as an Amount. Note that a `purse` can be empty.
  + js
    ```
    const quatloosPurse = quatloosIssuer.makeEmptyPurse();
    // Balance should be 0 Quatloos.
    const currentBalance = quatloosPurse.getCurrentAmount();
    // Deposit a payment of 5 Quatloos
    quatloosPurse.deposit(quatloosPayment5);
    // Balance should be 5 Quatloos
    const newBalance = quatloosPurse.getCurrentAmount();
    ```
* [aPurse.withdraw(amount)](/reference/ertp-api/purse.html#apurse-withdraw-amount)
  + Withdraw the `amount` of specified digital assets from this `purse` into a new `payment`.
  + js
    ```
    // Withdraw 3 Quatloos from a purse.
    const newPayment = quatloosPurse.withdraw(AmountMath.make(brand, 3n));
    ```
* [aPurse.deposit(payment, optAmount)](/reference/ertp-api/purse.html#apurse-deposit-payment-optamount)
  + Deposit all the contents of `payment` into this `purse`, returning an `amount` describing the `payment`.
  + js
    ```
    const quatloosPurse = quatloosIssuer.makeEmptyPurse();
    const quatloos123 = AmountMath.make(quatloosBrand, 123n);
    const quatloosPayment = quatloosMint.mintPayment(quatloos123);
    
    // Deposit a payment for 123 quatloos into the purse. Ensure that this is the amount you expect.
    quatloosPurse.deposit(quatloosPayment, quatloos123);
    const secondPayment = quatloosMint.mintPayment(
      AmountMath.make(quatloosBrand, 100n),
    );
    // Throws error since secondPayment is 100 Quatloos and quatloos123 is 123 Quatloos
    t.throws(() => quatloosPurse.deposit(secondPayment, quatloos123), {
      message:
        'amount: {"brand":"[Alleged: quatloos brand]","value":"[100n]"} - Must be: {"brand":"[Alleged: quatloos brand]","value":"[123n]"}',
    });
    ```
* [aPurse.getDepositFacet()](/reference/ertp-api/purse.html#apurse-getdepositfacet)
  + Return a deposit-only facet on the `purse`. Note that the command to add a `payment`'s assets via a `DepositFacet` is not `deposit()` but `receive()` as shown here.
  + js
    ```
    const depositOnlyFacet = purse.getDepositFacet();
    // Give depositOnlyFacet to someone else. They can pass a payment
    // that will be deposited:
    depositOnlyFacet.receive(payment);
    ```

In addition, the method to create a new, empty, `purse` is called on an `issuer`:

* [anIssuer.makeEmptyPurse()](/reference/ertp-api/issuer.html#anissuer-makeemptypurse)
  + Make and return an empty `purse` that holds assets of the `brand` associated with the `issuer`.
  + js
    ```
    const { issuer: quatloosIssuer } = makeIssuerKit('quatloos');
    // The new empty purse contains 0 Quatloos
    const quatloosPurse = quatloosIssuer.makeEmptyPurse();
    ```

Payments [​](#payments)
-----------------------

![Payment methods](/assets/payment.BLKLnBvj.svg)

Payments hold digital assets intended to be transferred to another party. They are linear, meaning that either a `payment` has its full original balance, or it is used up entirely. It is impossible to partially use a `payment`.

In other words, if you create a `payment` containing 10 Quatloos, the `payment` will always either contain 10 Quatloos or it will be deleted from its `issuer` records and no longer have any value. While a `payment` can be either combined with others or split into multiple `payments`, in both cases the original `payment(s)` are consumed and the results put in one or more new `payments`.

A `payment` can be deposited into a purse, split into multiple `payments`, combined with other `payments`, or claimed (getting an exclusive `payment` and revoking access from anyone else).

A `payment` is often received from other parties, but is not self-verifying and cannot be trusted to provide its own true value. To get the verified balance of a `payment`, use the `getAmountOf(payment)` method on the trusted `issuer` for the `payment`'s `brand`.

To get the `issuer` for a `brand` you didn't create, ask someone you trust. For example, the venue creating tickets for shows can be trusted to give you the tickets' `issuer`. Or, a friend might have a cryptocurrency they like, and, if you trust them, you might accept that the `issuer` they give you is valid.

To consume a `payment` into a new `purse`:

1. Get the `payment`'s trusted `issuer`.
2. Use the `issuer` to create an empty `purse` for that `brand`.
3. Deposit the `payment` into the new `purse`.

`Payments` have only one API method, but many methods for other ERTP components have `payments` as arguments and effectively operate on a `payment`. The following is a brief description and example of each `payment`-related method. For more detail, click the method's name to go to its entry in the [ERTP API Reference](/reference/ertp-api/index.html).

* [aPayment.getAllegedBrand()](/reference/ertp-api/payment.html#apayment-getallegedbrand)
  + Return the `brand` indicating the kind of digital asset this `payment` purports to be and which `issuer` to use with it. Because `payments` are not trusted, any method calls on them should be treated with suspicion and verified elsewhere. Any successful operation by an `issuer` on a `payment` verifies it.

### Other Objects' Payment-Related Methods [​](#other-objects-payment-related-methods)

* [anIssuer.burn(payment, optAmount)](/reference/ertp-api/issuer.html#anissuer-burn-payment-optamount)
  + Destroy all of the digital assets in the `payment`.
  + js
    ```
    const amountToBurn = AmountMath.make(quatloosBrand, 10n);
    const paymentToBurn = quatloosMint.mintPayment(amountToBurn);
    // burntAmount is 10 quatloos
    const burntAmount = await quatloosIssuer.burn(paymentToBurn, amountToBurn);
    ```
* [anIssuer.getAmountOf(payment)](/reference/ertp-api/issuer.html#anissuer-getamountof-payment)
  + Describe the `payment`'s balance as an Amount.
  + js
    ```
    const quatloosPayment = quatloosMint.mintPayment(
      AmountMath.make(quatloosBrand, 100n),
    );
    // returns an amount with a value of 100 and the quatloos brand
    quatloosIssuer.getAmountOf(quatloosPayment);
    ```
* [anIssuer.isLive(payment)](/reference/ertp-api/issuer.html#anissuer-islive-payment)
  + Return `true` if the `payment` was created by the issuer and is available for use (has not been consumed or burned).
* [aMint.mintPayment(newAmount)](/reference/ertp-api/mint.html#amint-mintpayment-newamount)
  + Create new digital assets of the `mint`'s associated `brand`.
  + js
    ```
    const { mint: quatloosMint, brand: quatloosBrand } =
      makeIssuerKit('quatloos');
    const quatloos1000 = AmountMath.make(quatloosBrand, 1000n);
    const newPayment = quatloosMint.mintPayment(quatloos1000);
    ```
* [aPurse.deposit(payment, optAmount)](/reference/ertp-api/purse.html#apurse-deposit-payment-optamount)
  + Deposit all the contents of `payment` into `purse`.
  + js
    ```
    const quatloosPurse = quatloosIssuer.makeEmptyPurse();
    const quatloos123 = AmountMath.make(quatloosBrand, 123n);
    const quatloosPayment = quatloosMint.mintPayment(quatloos123);
    
    // Deposit a payment for 123 quatloos into the purse. Ensure that this is the amount you expect.
    quatloosPurse.deposit(quatloosPayment, quatloos123);
    const secondPayment = quatloosMint.mintPayment(
      AmountMath.make(quatloosBrand, 100n),
    );
    // Throws error since secondPayment is 100 Quatloos and quatloos123 is 123 Quatloos
    t.throws(() => quatloosPurse.deposit(secondPayment, quatloos123), {
      message:
        'amount: {"brand":"[Alleged: quatloos brand]","value":"[100n]"} - Must be: {"brand":"[Alleged: quatloos brand]","value":"[123n]"}',
    });
    ```
* [aPurse.getDepositFacet()](/reference/ertp-api/purse.html#apurse-getdepositfacet)
  + Create and return a new deposit-only facet of the `purse` that allows arbitrary other parties to deposit Payments into `purse`.
  + js
    ```
    const depositOnlyFacet = purse.getDepositFacet();
    // Give depositOnlyFacet to someone else. They can pass a payment
    // that will be deposited:
    depositOnlyFacet.receive(payment);
    ```
* [aPurse.withdraw(amount)](/reference/ertp-api/purse.html#apurse-withdraw-amount)
  + Withdraw the `amount` of specified digital assets from `purse` into a new `payment`.
  + js
    ```
    // Withdraw 3 Quatloos from a purse.
    const newPayment = quatloosPurse.withdraw(AmountMath.make(brand, 3n));
    ```
    
    DEPRECATED
* [anIssuer.combine(paymentsArray)](/reference/ertp-api/issuer.html#anissuer-combine-paymentsarray-opttotalamount)
  + Combine multiple Payments into one new Payment.
  + js
    ```
    // create an array of 100 payments of 1 unit each
    const payments = [];
    for (let i = 0; i < 100; i += 1) {
      payments.push(quatloosMint.mintPayment(AmountMath.make(quatloosBrand, 1n)));
    }
    // combinedPayment equals 100
    const combinedPayment = combine(recoveryPurse, harden(payments));
    ```
* [anIissuer.claim(payment, optAmount)](/reference/ertp-api/issuer.html#anissuer-claim-payment-optamount)
  + Transfer all digital assets from `payment` to a new Payment.
  + js
    ```
    const amountToTransfer = AmountMath.make(quatloosBrand, 2n);
    const originalPayment = quatloosMint.mintPayment(amountToTransfer);
    const newPayment = await claim(
      recoveryPurse,
      originalPayment,
      amountToTransfer,
    );
    ```
* [anIssuer.splitMany(payment, amountArray)](/reference/ertp-api/issuer.html#anissuer-splitmany-payment-amountarray)
  + Split a single `payment` into multiple Payments.
  + js
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
    ```
* [anIssuer.split(payment, paymentAmountA)](/reference/ertp-api/issuer.html#anissuer-split-payment-paymentamounta)
  + Split a single `payment` into two new Payments.
  + js
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
    :::

Purse and Payment Example [​](#purse-and-payment-example)
---------------------------------------------------------

The following code creates a new `purse` for the `quatloos` brand, deposits 10 Quatloos into the `purse`, withdraws 3 Quatloos from the `purse` into a `payment`, and finally returns an `amount` describing what's currently in the `purse`, 7 Quatloos.

js
```
// Create a purse with a balance of 10 Quatloos
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand,
} = makeIssuerKit('quatloos');
const quatloosPurse = quatloosIssuer.makeEmptyPurse();
const quatloos10 = AmountMath.make(quatloosBrand, 10n);
const quatloosPayment = quatloosMint.mintPayment(quatloos10);
// If the two arguments aren't equal (i.e. both need to be for 10 Quatloos),
// throws an error. But they are both for 10 Quatloos, so no problem.
quatloosPurse.deposit(quatloosPayment, quatloos10);

// Withdraw 3 Quatloos from the purse into a payment
const quatloos3 = AmountMath.make(quatloosBrand, 3n);
const withdrawalPayment = quatloosPurse.withdraw(quatloos3);

// The balance of the withdrawal payment is 3 Quatloos
await quatloosIssuer.getAmountOf(withdrawalPayment);

// The new balance of the purse is 7 Quatloos
quatloosPurse.getCurrentAmount();
```
