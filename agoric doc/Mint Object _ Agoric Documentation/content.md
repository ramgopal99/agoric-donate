

Mint Object [​](#mint-object)
=============================

Only a **Mint** can issue new digital assets.

A **Mint** has a one-to-one relationship with both an **[Issuer](./issuer.html)** and a **[Brand](./brand.html)**. So it can only mint new assets of that **Brand** and is the only **Mint** that can mint new assets of that **Brand**.

**Mints** are created by calling the **[makeIssuerKit()](./issuer.html#makeissuerkit-allegedname-assetkind-displayinfo-optshutdownwithfailure-elementshape)** function. See the **[Issuer](./issuer.html)** documentation for detailed information about how to use this function.

aMint.getIssuer() [​](#amint-getissuer)
---------------------------------------

* Returns: **[Issuer](./issuer.html)**

Returns the **Issuer** uniquely associated with this **Mint**. From its creation, a **Mint** is always in an unchangeable one-to-one relationship with a particular **Issuer**.

js
```
const { issuer: quatloosIssuer, mint: quatloosMint } =
  makeIssuerKit('quatloos');
const quatloosMintIssuer = quatloosMint.getIssuer();

// Returns true
issuer === quatloosMintIssuer;
```

aMint.mintPayment(newAmount) [​](#amint-mintpayment-newamount)
--------------------------------------------------------------

* **newAmount**: **[Amount](./ertp-data-types.html#amount)**
* Returns: **[Payment](./payment.html)**

Creates and returns new digital assets of the **Mint**'s associated **[Brand](./brand.html)**. From its creation, a **Mint** is always in an unchangeable one-to-one relationship with a **Brand**.

js
```
const {
  issuer: quatloosIssuer,
  mint: quatloosMint,
  brand: quatloosBrand
} = makeIssuerKit('quatloos');

const quatloos1000 = amountMath.make(quatloosBrand, 1000n);
// newPayment will have a balance of 1000 Quatloos
const newPayment = quatloosMint.mintPayment(quatloos1000);
```

Important

**aMint.mintPayment()** is the only way to create new digital assets. There is no other way.

