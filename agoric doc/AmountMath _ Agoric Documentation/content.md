

AmountMath [​](#amountmath)
===========================

![AmountMath methods](/assets/amount-math.DFzv5oHK.svg)

Depositing and withdrawing assets from a `purse` and manipulating `payment` amounts all require adding and subtracting digital assets. ERTP uses the `AmountMath` library for all these operations.

The `AmountMath` library functions work for both fungible and nonfungible tokens. There are two `AssetKinds`, each of which implements the same methods. Which kind is used for a particular `brand` depends on what was specified when the `brand` and its `issuer` were created. They are:

* `AssetKind.NAT` ("nat"): Used with fungible assets. Values are natural numbers using the JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) type to avoid overflow risks from using the usual JavaScript `Number` type.
* `AssetKind.SET` ("set"): Used with non-fungible assets. Values are [copyArray](./../js-programming/far.html#passstyleof-api)s such as hardened arrays of strings.

AmountMath Methods [​](#amountmath-methods)
-------------------------------------------

The following is a brief description and example of each `AmountMath` method. For more detail, click the method's name to go to its entry in the [ERTP API Reference](/reference/ertp-api/).

Note that many methods have a `brand` argument, either required or optional. Where optional, use the `brand` you got from an issuer (or from Zoe) to add verification that the `brand` of "amount" argument(s) corresponds with that `brand`.

* **Information Getting Methods**
  + [AmountMath.getValue(brand, amount)](/reference/ertp-api/amount-math.html#amountmath-getvalue-brand-amount)
    - Returns the `value` of the `amount` argument. For fungible assets, this will be a `BigInt`.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      const quatloos123 = AmountMath.make(quatloosBrand, 123n);
      // returns 123
      const value = AmountMath.getValue(quatloosBrand, quatloos123);
      ```
* **Comparison Methods**
  + [AmountMath.isEmpty(amount, brand?)](/reference/ertp-api/amount-math.html#amountmath-isempty-amount-brand)
    - Returns `true` if its `amount` argument is empty, otherwise `false`. Throws an error if the optional `brand` argument isn't the same as the `amount` argument brand.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
      const quatloos1 = AmountMath.make(quatloosBrand, 1n);
      // returns true
      AmountMath.isEmpty(empty);
      // returns false
      AmountMath.isEmpty(quatloos1);
      ```
  + [AmountMath.isGTE(leftAmount, rightAmount, brand?)](/reference/ertp-api/amount-math.html#amountmath-isgte-leftamount-rightamount-brand)
    - Returns `true` if the `leftAmount` argument is greater than or equal to the `rightAmount` argument, otherwise `false`. Throws an error if the optional `brand` argument isn't the same as the `amount` arguments brands.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
      const quatloos1 = AmountMath.make(quatloosBrand, 1n);
      // Returns true
      AmountMath.isGTE(quatloos1, empty);
      // Returns false
      AmountMath.isGTE(empty, quatloos1);
      ```
  + [AmountMath.isEqual(leftAmount, rightAmount, brand?)](/reference/ertp-api/amount-math.html#amountmath-isequal-leftamount-rightamount-brand)
    - Returns `true` if the `leftAmount` argument equals the `rightAmount` argument. Throws an error if the optional `brand` argument isn't the same as the `amount` arguments brands.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
      const quatloos1 = AmountMath.make(quatloosBrand, 1n);
      const anotherQuatloos1 = AmountMath.make(quatloosBrand, 1n);
      
      // Returns true
      AmountMath.isEqual(quatloos1, anotherQuatloos1);
      // Returns false
      AmountMath.isEqual(empty, quatloos1);
      ```
  + [AmountMath.coerce(brand, allegedAmount)](/reference/ertp-api/amount-math.html#amountmath-coerce-brand-allegedamount)
    - Takes an `amount` and returns it if it's a valid `amount`. If invalid, it throws an error.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      const quatloos50 = AmountMath.make(quatloosBrand, 50n);
      AmountMath.coerce(quatloosBrand, quatloos50); // equal to quatloos50
      ```
* **Manipulator Methods**
  + [AmountMath.add(leftAmount, rightAmount, brand?)](/reference/ertp-api/amount-math.html#amountmath-add-leftamount-rightamount-brand)
    - Returns an `amount` that is the union of the `leftAmount` and `rightAmount``amount` arguments. For a fungible `amount`, this means add their values. For a non-fungible `amount`, it usually means including all elements from both `leftAmount` and `rightAmount`. Throws an error if the optional `brand` argument isn't the same as the `amount` arguments brands.
    - js
      ```
      const { brand: myItemsBrand } = makeIssuerKit('myItems', 'set');
      const listAmountA = AmountMath.make(myItemsBrand, harden(['1', '2', '4']));
      const listAmountB = AmountMath.make(myItemsBrand, harden(['3']));
      
      // Returns an amount containing all of ['1', '2', '4', '3']
      const combinedList = AmountMath.add(listAmountA, listAmountB);
      ```
  + [AmountMath.subtract(leftAmount, rightAmount, brand?)](/reference/ertp-api/amount-math.html#amountmath-subtract-leftamount-rightamount-brand)
    - Returns a new `amount` that is the `leftAmount` argument minus the `rightAmount` argument (i.e., for strings or objects everything in `leftAmount` not in `rightAmount`). If `leftAmount` doesn't include the contents of `rightAmount`, it throws an error. It also throws an error if the optional `brand` argument isn't the same as the `amount` arguments brands.
    - js
      ```
      const { brand: myItemsBrand } = makeIssuerKit('myItems', 'set');
      const listAmountA = AmountMath.make(myItemsBrand, harden(['1', '2', '4']));
      const listAmountB = AmountMath.make(myItemsBrand, harden(['3']));
      const listAmountC = AmountMath.make(myItemsBrand, harden(['2']));
      // Returns ['1', '4']
      const subtractedList = AmountMath.subtract(listAmountA, listAmountC);
      // Throws error
      t.throws(() => AmountMath.subtract(listAmountA, listAmountB), {
        message: /right element .* was not in left/,
      });
      ```
* **Amount Creation Methods**
  + [AmountMath.make(brand, allegedValue)](/reference/ertp-api/amount-math.html#amountmath-make-brand-allegedvalue)
    - Takes a `value` argument and returns an `amount` by making a record with the `value` and the `brand` associated with the `AmountMath`. The `value` argument should be represented as a `BigInt` e.g. `10n` rather than `10`.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      /// An `amount` with `value` = 837 and `brand` = Quatloos
      const quatloos837 = AmountMath.make(quatloosBrand, 837n);
      const anotherQuatloos837 = harden({ brand: quatloosBrand, value: 837n });
      t.deepEqual(quatloos837, anotherQuatloos837);
      ```
  + [AmountMath.makeEmpty(brand, assetKind)](/reference/ertp-api/amount-math.html#amountmath-makeempty-brand-assetkind)
    - Returns an `amount` representing an empty `amount`, which is the identity element for the `AmountMath` `add()` and `subtract()` operations. Note that this value varies depending on the `brand` and whether it is of kind `AssetKind.NAT` or `AssetKind.SET`.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      // Returns an empty amount for this issuer.
      // Since this is a fungible amount it returns 0
      const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
      ```
  + [AmountMath.makeEmptyFromAmount(amount)](/reference/ertp-api/amount-math.html#amountmath-makeemptyfromamount-amount)
    - Returns an `amount` representing an empty `amount`, using another `amount` as the template for the new empty amount's `brand` and `assetKind`.
    - js
      ```
      const { brand: quatloosBrand } = makeIssuerKit('quatloos');
      // Returns an empty amount for this issuer.
      // Since this is a fungible amount it returns 0
      const empty = AmountMath.makeEmpty(quatloosBrand, AssetKind.NAT);
      // quatloosAmount837 = { value: 837n, brand: quatloos }
      const quatloosAmount837 = AmountMath.make(quatloosBrand, 837n);
      // Returns an amount = { value: 0n, brand: quatloos }
      const quatloosAmount0 = AmountMath.makeEmptyFromAmount(quatloosAmount837);
      ```

Methods On Other Objects [​](#methods-on-other-objects)
-------------------------------------------------------

These methods return an **[AssetKind](/reference/ertp-api/ertp-data-types.html#assetkind)**:

* [anIssuer.getAssetKind()](/reference/ertp-api/issuer.html#anissuer-getassetkind)
  + Returns the `AssetKind` of the `issuer`'s `brand`. (`AssetKind.NAT` or `AssetKind.SET`).
  + js
    ```
    const myAssetKind = quatloosIssuer.getAssetKind();
    ```
* [zcf.getAssetKind(brand)](/reference/zoe-api/zoe-contract-facet.html#zcf-getassetkind-brand)
  + Returns the `AssetKind` of the `brand` argument.
  + js
    ```
    const quatloosAssetKind = zcf.getAssetKind(quatloosBrand);
    ```
