

AmountMath Object [​](#amountmath-object)
=========================================

Library for manipulating and analyzing **[Amounts](./ertp-data-types.html#amount)**.

Importing and Using AmountMath [​](#importing-and-using-amountmath)
-------------------------------------------------------------------

To use **AmountMath**, import it from ERTP:

* `import { AmountMath } from '@agoric/ertp';`

Brand Parameters [​](#brand-parameters)
---------------------------------------

Note that many **AmountMath** methods have an optional **[Brand](./brand.html)** parameter. For these methods, you should pass in a **Brand** argument you got from when you need to do an "absolute" check on the **Brand** within an **[Amount](./ertp-data-types.html#amount)** parameter. In this case, you want to use the **Brand** you got from the **Issuer** (or from Zoe) as the optional parameter to compare the **Amount** **Brand**(s) to. If they are not equal, an error is thrown and no changes are made.

AmountMath.make(brand, allegedValue) [​](#amountmath-make-brand-allegedvalue)
-----------------------------------------------------------------------------

* **brand**: **[Brand](./brand.html)**
* **allegedValue**: **[AmountValue](./ertp-data-types.html#amountvalue)**
* Returns: **[Amount](./ertp-data-types.html#amount)**

Creates an **Amount** from a given **Brand** and **AmountValue**.

js
```
const bid = AmountMath.make(quatloosBrand, 300n);
```

AmountMath.coerce(brand, allegedAmount) [​](#amountmath-coerce-brand-allegedamount)
-----------------------------------------------------------------------------------

* **brand**: **[Brand](./brand.html)**
* **allegedAmount**: **[Amount](./ertp-data-types.html#amount)**
* Returns: **Amount**

Verifies that an **Amount** is for the specified *brand* and returns an equivalent **Amount**. If the **Amount** is not for the specified **Brand**, an error is thrown.

js
```
const verifiedAmount = AmountMath.coerce(quatloosBrand, bid);
```

AmountMath.getValue(brand, amount) [​](#amountmath-getvalue-brand-amount)
-------------------------------------------------------------------------

* **brand**: **[Brand](./brand.html)**
* **amount**: **[Amount](./ertp-data-types.html#amount)**
* Returns: **[AmountValue](./ertp-data-types.html#amountvalue)**

Returns the **AmountValue** from the given **Amount**.

js
```
const quatloos123 = AmountMath.make(quatloosBrand, 123n);

// Returns 123n
AmountMath.getValue(quatloosBrand, quatloos123);
```

AmountMath.makeEmpty(brand, assetKind) [​](#amountmath-makeempty-brand-assetkind)
---------------------------------------------------------------------------------

* **brand**: **[Brand](./brand.html)**
* **assetKind**: **[AssetKind](./ertp-data-types.html#assetkind)**
* Returns: **[Amount](./ertp-data-types.html#amount)**

Returns the **Amount** representing an empty **Amount** for the *brand* parameter's **Brand**. This is the identity element for **AmountMath.add()** and **AmountMath.subtract()**. The empty **AmountValue** depends on whether the *assetKind* is **AssetKind.NAT** (`0n`), **AssetKind.COPY\_SET** (`[]`), or **AssetKind.COPY\_BAG** (`[]`).

js
```
// Returns an amount with 0n as its value
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
```

AmountMath.makeEmptyFromAmount(amount) [​](#amountmath-makeemptyfromamount-amount)
----------------------------------------------------------------------------------

* **amount**: **[Amount](./ertp-data-types.html#amount)**
* Returns: **Amount**

Returns an empty **Amount** for the **Brand** of the *amount* parameter.

js
```
// bid = { brand: quatloosBrand, value: 300n }
const bid = AmountMath.make(quatloosBrand, 300n);
// Returns { brand: quatloosBrand, value: 0n }
const zeroQuatloos = AmountMath.makeEmptyFromAmount(bid);
```

AmountMath.isEmpty(amount, brand?) [​](#amountmath-isempty-amount-brand)
------------------------------------------------------------------------

* **amount**: **[Amount](./ertp-data-types.html#amount)**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Boolean**

Returns **true** if the **Amount** is empty. Otherwise returns **false**.

If the optional *brand* argument doesn't match the **Amount**'s **Brand**, an error is thrown.

js
```
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
const quatloos1 = AmountMath.make(quatloosBrand, 1n);

// Returns true
const result = AmountMath.isEmpty(empty);

// Returns false
const result = AmountMath.isEmpty(quatloos1);
```

AmountMath.isGTE(leftAmount, rightAmount, brand?) [​](#amountmath-isgte-leftamount-rightamount-brand)
-----------------------------------------------------------------------------------------------------

* **leftAmount**: **[Amount](./ertp-data-types.html#amount)**
* **rightAmount**: **Amount**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Boolean**

Returns **true** if the **[AmountValue](./ertp-data-types.html#amountvalue)** of *leftAmount* is greater than or equal to the **AmountValue** of *rightAmount*. Both **Amount** arguments must have the same **Brand**.

If the optional *brand* argument doesn't match the **Amount**s' **Brand**, an error is thrown.

For non-fungible **AmountValues**, what "greater than or equal to" is depends on the kind of **AmountMath**. For example, { 'seat 1', 'seat 2' } is considered greater than { 'seat 2' } because the former is a strict superset of the latter.

js
```
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
const quatloos5 = AmountMath.make(quatloosBrand, 5n);
const quatloos10 = AmountMath.make(quatloosBrand, 10n);

// Returns true
AmountMath.isGTE(quatloos5, empty);
// Returns false
AmountMath.isGTE(empty, quatloos5, quatloosBrand);
// Returns true
AmountMath.isGTE(quatloos10, quatloos5);
// Returns false
AmountMath.isGTE(quatloos5, quatloos10);
// Returns true
AmountMath.isGTE(quatloos5, quatloos5);
```

AmountMath.isEqual(leftAmount, rightAmount, brand?) [​](#amountmath-isequal-leftamount-rightamount-brand)
---------------------------------------------------------------------------------------------------------

* **leftAmount**: **[Amount](./ertp-data-types.html#amount)**
* **rightAmount**: **Amount**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Boolean**

Returns **true** if the **[AmountValue](./ertp-data-types.html#amountvalue)** of *leftAmount* is equal to the **AmountValue** of *rightAmount*. Both **Amount** arguments must have the same **Brand**.

If the optional *brand* argument doesn't match the **Amount**s' **Brand**, an error is thrown.

For non-fungible **AmountValues**, "equal to" depends on the value of the **Brand's** **[AssetKind](./ertp-data-types.html#assetkind)**.

For example, { 'seat 1', 'seat 2' } is considered unequal to { 'seat 2' } because the number of elements differ. { 'seat 1' } is considered unequal to { 'seat 2' } because the elements do not match.

js
```
const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
const quatloos5 = AmountMath.make(quatloosBrand, 5n);
const quatloos5b = AmountMath.make(quatloosBrand, 5n);
const quatloos10 = AmountMath.make(quatloosBrand, 10n);

// Returns true
AmountMath.isEqual(quatloos10, quatloos10);
// Returns true
AmountMath.isEqual(quatloos5, quatloos5b);
// Returns false
AmountMath.isEqual(quatloos10, quatloos5);
// Returns false
AmountMath.isEqual(empty, quatloos10);
```

AmountMath.add(leftAmount, rightAmount, brand?) [​](#amountmath-add-leftamount-rightamount-brand)
-------------------------------------------------------------------------------------------------

* **leftAmount**: **[Amount](./ertp-data-types.html#amount)**
* **rightAmount**: **Amount**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Amount**

Returns a new **Amount** that is the combination of *leftAmount* and *rightAmount*. Both **Amount** arguments must have the same **Brand**.

If the optional *brand* argument doesn't match the **Amount**s' **Brand**, an error is thrown.

For fungible **Amounts** this means adding their **[AmountValues](./ertp-data-types.html#amountvalue)**. For non-fungible **Amounts**, it usually means including all of the elements from *leftAmount* and *rightAmount*.

If one of *leftAmount* or *rightAmount* is empty, this method returns an **Amount** equivalent to the other. If both are empty, this method returns an empty **Amount**.

js
```
import { AssetKind, makeIssuerKit, AmountMath } from '@agoric/ertp';
const { brand: myItemsBrand } = makeIssuerKit('myItems', AssetKind.COPY_SET);
const listAmountA = AmountMath.make(myItemsBrand, ['1', '2', '4']);
const listAmountB = AmountMath.make(myItemsBrand, ['3']);

// Returns an amount whose value is ['1', '2', '4', '3']
const combinedList = AmountMath.add(listAmountA, listAmountB);
```

AmountMath.subtract(leftAmount, rightAmount, brand?) [​](#amountmath-subtract-leftamount-rightamount-brand)
-----------------------------------------------------------------------------------------------------------

* **leftAmount**: **[Amount](./ertp-data-types.html#amount)**
* **rightAmount**: **Amount**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Amount**

Returns a new **Amount** that is the *leftAmount* minus the *rightAmount* (i.e., everything in the *leftAmount* that is not in the *rightAmount*). If *leftAmount* doesn't include *rightAmount* (e.g., subtraction results in a negative), an error is thrown. Because *leftAmount* must include *rightAmount*, this is **not** equivalent to set subtraction.

Both **Amount** arguments must have the same **Brand**.

If the optional *brand* argument doesn't match the **Amount**s' **Brand**, an error is thrown.

If *rightAmount* is empty, this method returns *leftAmount*. If both arguments are empty, this method returns an empty **Amount**.

js
```
import { AssetKind, makeIssuerKit, AmountMath } from '@agoric/ertp';
const { brand: myItemsBrand } = makeIssuerKit('myItems', AssetKind.COPY_SET);
const listAmountA = AmountMath.make(myItemsBrand, ['1', '2', '4']);
const listAmountB = AmountMath.make(myItemsBrand, ['3']);
const listAmountC = AmountMath.make(myItemsBrand, ['2']);

// Returns ['1', '4']
const subtractedList = AmountMath.subtract(listAmountA, listAmountC);

// Throws an error
const badList = AmountMath.subtract(listAmountA, listAmountB);
```

AmountMath.min(x, y, brand?) [​](#amountmath-min-x-y-brand)
-----------------------------------------------------------

* **x**: **[Amount](./ertp-data-types.html#amount)**
* **y**: **Amount**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Amount**

Returns the minimum value between *x* and *y*.

Both **Amount** arguments must have the same **Brand**.

If the optional *brand* argument doesn't match the **Amount**s' **Brand**, an error is thrown.

js
```
const smallerAmount = AmountMath.make(quatloosBrand, 5n);
const largerAmount = AmountMath.make(quatloosBrand, 10n);

// Returns an amount equivalent to smallerAmount
const comparisonResult = AmountMath.min(smallerAmount, largerAmount);
```

AmountMath.max(x, y, brand?) [​](#amountmath-max-x-y-brand)
-----------------------------------------------------------

* **x**: **[Amount](./ertp-data-types.html#amount)**
* **y**: **Amount**
* **brand**: **[Brand](./brand.html)** - Optional, defaults to **undefined**.
* Returns: **Amount**

Returns the maximum value between *x* and *y*.

Both **Amount** arguments must have the same **Brand**.

If the optional *brand* argument doesn't match the **Amount**s' **Brand**, an error is thrown.

js
```
const smallerAmount = AmountMath.make(quatloosBrand, 5n);
const largerAmount = AmountMath.make(quatloosBrand, 10n);

// Returns an amount equivalent to largerAmount
const comparisonResult = AmountMath.max(smallerAmount, largerAmount);
```

Related Methods [​](#related-methods)
-------------------------------------

The following methods on other ERTP components and objects also either operate on or return an **Amount** or **AssetKind**.

* [**anIssuer.getAmountOf()**](./issuer.html#anissuer-getamountof-payment)
  + Returns the **Amount** of a **Payment**.
* [**anIssuer.getAssetKind()**](./issuer.html#anissuer-getassetkind)
  + Returns the **AssetKind** of the **Issuer**'s associated math helpers.
* [**zcf.getAssetKind()**](/reference/zoe-api/zoe-contract-facet.html#zcf-getassetkind-brand)
  + Returns the **AssetKind** associated with a **Brand**.
