

PriceAuthority Object [​](#priceauthority-object)
=================================================

We rely on **PriceAuthority** oracles. A **PriceAuthority** gives reliable quotes for prices. The quotes might be based on broad surveys of prices across the ecosystem, or might come directly from an AMM (Automatic Market Maker). A **PriceAuthority** can either give a quote for the current price across any pair of currencies it knows about, or can immediately return a **Promise** resolved when a condition is true. For example, a price crossing some threshold, or at a particular time. It can also provide a price feed that updates with every price change.

E(PriceAuthority).getQuoteIssuer(brandIn, brandOut) [​](#e-priceauthority-getquoteissuer-brandin-brandout)
----------------------------------------------------------------------------------------------------------

* **brandIn**: **[Brand](/reference/ertp-api/brand.html)**
* **brandOut**: **Brand**
* Returns: **[Issuer](/reference/ertp-api/issuer.html) | Promise<Issuer>**

Gets the ERTP **Issuer** of **[PriceQuotes](./zoe-data-types.html#pricequote)** for a given *brandIn*/*brandOut* pair.

js
```
const quoteIssuer = await E(PriceAuthority).getQuoteIssuer(
  collateralKit.brand,
  loanKit.brand
);
```

E(PriceAuthority).getTimerService(brandIn, brandOut) [​](#e-priceauthority-gettimerservice-brandin-brandout)
------------------------------------------------------------------------------------------------------------

* **brandIn**: **[Brand](/reference/ertp-api/brand.html)**
* **brandOut**: **Brand**
* Returns: **TimerService | Promise<TimerService>**

Gets the timer used in **[PriceQuotes](./zoe-data-types.html#pricequote)** for a given *brandIn*/*brandOut* pair.

js
```
const myTimer = E(PriceAuthority).getTimerService(
  collateral.brand,
  loanKit.brand
);
```

E(PriceAuthority).makeQuoteNotifier(amountIn, brandOut) [​](#e-priceauthority-makequotenotifier-amountin-brandout)
------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **brandOut**: **[Brand](/reference/ertp-api/brand.html)**
* Returns: **ERef<Notifier<[PriceQuote](./zoe-data-types.html#pricequote)>>**

Be notified of the latest **PriceQuotes** for a given *amountIn*. The issuing rate may be very different between **PriceAuthorities**.

js
```
const myNotifier = E(PriceAuthority).makeQuoteNotifier(quatloos100, usdBrand);
```

E(PriceAuthority).quoteGiven(amountIn, brandOut) [​](#e-priceauthority-quotegiven-amountin-brandout)
----------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **brandOut**: **[Brand](/reference/ertp-api/brand.html)**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Gets a quote on-demand corresponding to *amountIn*.

js
```
const quote = await E(PriceAuthority).quoteGiven(moola500, quatloosBrand);
```

E(PriceAuthority).quoteWanted(brandIn, amountOut) [​](#e-priceauthority-quotewanted-brandin-amountout)
------------------------------------------------------------------------------------------------------

* **brandIn**: **[Brand](/reference/ertp-api/brand.html)**
* **amountOut**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Gets a quote on-demand corresponding to *amountOut*.

js
```
const quote = await E(PriceAuthority).quoteWanted(quatloosBrand, moola500);
```

E(PriceAuthority).quoteAtTime(deadline, amountIn, brandOut) [​](#e-priceauthority-quoteattime-deadline-amountin-brandout)
-------------------------------------------------------------------------------------------------------------------------

* **deadline**: **Timestamp**
* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **brandOut**: **[Brand](/reference/ertp-api/brand.html)**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Resolves after *deadline* passes on the **PriceAuthority**’s **timerService** with the **PriceQuote** of *amountIn* at that time. Note that *deadline*'s value is a **BigInt**.

js
```
const priceQuoteOnThisAtTime = E(PriceAuthority).quoteAtTime(
  7n,
  quatloosAmount34,
  usdBrand
);
```

E(PriceAuthority).quoteWhenGT(amountIn, amountOutLimit) [​](#e-priceauthority-quotewhengt-amountin-amountoutlimit)
------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Resolves when a **PriceQuote** of *amountIn* exceeds *amountOutLimit*.

js
```
const quote = E(PriceAuthority).quoteWhenGT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).quoteWhenGTE(amountIn, amountOutLimit) [​](#e-priceauthority-quotewhengte-amountin-amountoutlimit)
--------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Resolves when a **PriceQuote** of *amountIn* reaches or exceeds *amountOutLimit*.

js
```
const quote = E(PriceAuthority).quoteWhenGTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).quoteWhenLT(amountIn, amountOutLimit) [​](#e-priceauthority-quotewhenlt-amountin-amountoutlimit)
------------------------------------------------------------------------------------------------------------------

* **amountIn** **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit** **Amount**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Resolves when a **PriceQuote** of *amountIn* drops below *amountOutLimit*.

js
```
const quote = E(PriceAuthority).quoteWhenLT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).quoteWhenLTE(amountIn, amountOutLimit) [​](#e-priceauthority-quotewhenlte-amountin-amountoutlimit)
--------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[PriceQuote](./zoe-data-types.html#pricequote)>**

Resolves when a **PriceQuote** of *amountIn* reaches or drops below *amountOutLimit*.

js
```
const quote = E(PriceAuthority).quoteWhenLTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).mutableQuoteWhenGT(amountIn, amountOutLimit) [​](#e-priceauthority-mutablequotewhengt-amountin-amountoutlimit)
--------------------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[MutableQuote](./zoe-data-types.html#mutablequote)>**

Resolves when a **PriceQuote** of *amountIn* exceeds *amountOutLimit*.

js
```
const quote = E(PriceAuthority).mutableQuoteWhenGT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).mutableQuoteWhenGTE(amountIn, amountOutLimit) [​](#e-priceauthority-mutablequotewhengte-amountin-amountoutlimit)
----------------------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[MutableQuote](./zoe-data-types.html#mutablequote)>**

Resolves when a **PriceQuote** of *amountIn* reaches or exceeds *amountOutLimit*.

js
```
const quote = E(PriceAuthority).mutableQuoteWhenGTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).mutableQuoteWhenLT(amountIn, amountOutLimit) [​](#e-priceauthority-mutablequotewhenlt-amountin-amountoutlimit)
--------------------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[MutableQuote](./zoe-data-types.html#mutablequote)>**

Resolves when a **PriceQuote** of *amountIn* drops below *amountOutLimit*.

js
```
const quote = E(PriceAuthority).mutableQuoteWhenLT(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

E(PriceAuthority).mutableQuoteWhenLTE(amountIn, amountOutLimit) [​](#e-priceauthority-mutablequotewhenlte-amountin-amountoutlimit)
----------------------------------------------------------------------------------------------------------------------------------

* **amountIn**: **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**
* **amountOutLimit**: **Amount**
* Returns: **Promise<[MutableQuote](./zoe-data-types.html#mutablequote)>**

Resolves when a **PriceQuote** of *amountIn* reaches or drops below *amountOutLimit*.

js
```
const quote = E(PriceAuthority).mutableQuoteWhenLTE(
  AmountMath.make(brands.In, 29n),
  AmountMath.make(brands.Out, 974n)
);
```

MutableQuote [​](#mutablequote)
-------------------------------

A **MutableQuote** represents a statement from a **[PriceAuthority](./price-authority.html)** as to the current price level at a particular time. The significant content (prices and time) is packaged in the **[Amount](/reference/ertp-api/ertp-data-types.html#amount)**, and repeated in the **[Payment](/reference/ertp-api/payment.html)** for veracity.

**MutableQuotes** should be used when you expect to make multiple calls, replacing the trigger value. If you just need a single quote, and won't change the trigger level, you should use **PriceQuotes**.

A **MutableQuote** is an **Amount**-**Payment** pair, where the **Amount** is also the current balance of the **Payment**.

PriceQuote [​](#pricequote)
---------------------------

A **PriceQuote** represents a statement from a **[PriceAuthority](./price-authority.html)** as to the current price level at a particular time. The significant content (prices and time) is packaged in the **[Amount](/reference/ertp-api/ertp-data-types.html#amount)** and repeated in the **[Payment](/reference/ertp-api/payment.html)** for veracity. A **PriceQuote** is an **Amount**-**Payment** pair, where the **Amount** is also the current balance of the **Payment**.

js
```
const { quoteAmount, quotePayment } = priceQuote;
```

**PriceQuotes** are returned in two forms:

* **PriceDescription**
  + Always includes **amountIn**, **amountOut**, the quote's **Timestamp**, and the **TimerService** the **Timestamp** is relative to.
* **PriceDescription** wrapped as a **QuoteAuthority** issued payment.
  + This lets quotes be shared in a format letting others verify the time and values.
