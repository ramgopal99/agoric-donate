

Brand Object [​](#brand-object)
===============================

A **Brand** identifies the asset type of the **[Issuer](./issuer.html)** and **[Mint](./mint.html)** associated with the **Brand**. A given **Brand** has a one-to-one relationship with an **Issuer** and a **Mint**, and a one-to-many relationship with **[Purses](./purse.html)** and **[Payments](./payment.html)**.

For example, if you were to create a **Brand** that uses *Quatloos*:

* There would be exactly one *Quatloos* **Issuer**.
* There would be exactly one *Quatloos* **Mint**.
* There could be any number of **Purses** that could hold *Quatloos*.
* There could be any number of **Payments** that could hold *Quatloos*.

All of these relationships are unchangeable. For example, if a **Mint** is created that makes new *Quatloos*, it can never create non-*Quatloos* assets. Similarly, the *Quatloos* **Brand** will always be associated with the *Quatloos* **Mint** and *Quatloos* **Issuer**.

aBrand.isMyIssuer(allegedIssuer) [​](#abrand-ismyissuer-allegedissuer)
----------------------------------------------------------------------

* **allegedIssuer**: **[Issuer](./issuer.html)**
* Returns: **Boolean**

Returns **true** if *allegedIssuer* is the **Brand**'s **Issuer**. Returns **false** if it's not.

Note that a **Brand** from an untrusted source can misrepresent its association with an **Issuer**. The claim should be cross-checked using the **Issuer's**[**anIssuer.getBrand()**](./issuer.html#anissuer-getbrand) method for mutual agreement.

js
```
const isIssuer = brand.isMyIssuer(issuer);
```

aBrand.getAllegedName() [​](#abrand-getallegedname)
---------------------------------------------------

* Returns: **String**

Returns the alleged name of the **Brand**.

An alleged name is a human-readable string name of a type of digital asset. It should not be trusted as accurate since there is no public registry or expectation of uniqueness. This means there can be multiple **[Issuers](./issuer.html)**, **[Mints](./mint.html)**, or **Brands** with the same alleged name, and thus the name by itself does not uniquely identify an **Issuer**. Rather, the **Brand** object does that.

To put it another way, nothing stops different people from creating multiple **Issuers** with the alleged name *Quatloos*, but that doesn't make any of them the *Quatloos* **Issuer**. The alleged name is just a human readable string which is helpful for debugging.

js
```
const name = brand.getAllegedName();
```

aBrand.getDisplayInfo() [​](#abrand-getdisplayinfo)
---------------------------------------------------

* Returns: **[DisplayInfo](./ertp-data-types.html#displayinfo)**

Returns the **DisplayInfo** associated with the **Brand**.

You use a **DisplayInfo** object at the dapp and UI levels to correctly display **[Amounts](./ertp-data-types.html#amount)**. For fungible tokens, use the **decimalPlaces** property to display their value in the commonly used denomination, rather than the smallest denomination used for financial accounting (e.g., displaying in dollars rather than cents).

js
```
const quatloosDisplay = quatloosBrand.getDisplayInfo();
```

aBrand.getAmountShape() [​](#abrand-getamountshape)
---------------------------------------------------

* Returns: **[AmountShape](./ertp-data-types.html#amountshape)**

Returns the **AmountShape** for a **Brand** associated with a non-fungible asset.

Related Methods [​](#related-methods)
-------------------------------------

The following methods on other ERTP components are also related to the **Brand** object.

* [**anIssuer.getBrand()**](./issuer.html#anissuer-getbrand): Returns the **Brand** for the **Issuer**.
* [**aPayment.getAllegedBrand()**](./payment.html#apayment-getallegedbrand): Returns the **Payment**'s alleged **Brand**.
