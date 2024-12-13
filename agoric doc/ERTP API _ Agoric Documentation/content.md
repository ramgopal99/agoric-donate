

ERTP API [​](#ertp-api)
=======================

The ERTP API supports the following objects:

| Object | Description |
| --- | --- |
| [Issuer](./issuer.html) | The authority on what holds digital assets of its kind. |
| [Mint](./mint.html) | Can issue new digital assets. |
| [Brand](./brand.html) | Identifies the asset type of the associated **Issuer** and **Mint**. |
| [Purse](./purse.html) | Holds digital assets. |
| [Payment](./payment.html) | Holds digital assets that are in transit. |

The ETRP API uses the following library:

| Object | Description |
| --- | --- |
| [AmountMath](./amount-math.html) | The **AmountMath** object has several methods which can be used to manipulate and analyze **[Amounts](./ertp-data-types.html#amount)**. |

The ERTP API introduces and uses the following data types:

| Data Type | Description |
| --- | --- |
| [Amount](./ertp-data-types.html#amount) | Describes digital assets, specifying the number and **[Brand](./brand.html)** of assets. Note that **Amounts** can describe either fungible or non-fungible assets. |
| [AmountShape](./ertp-data-types.html#amountshape) | Describes digital assets, specifying the properties and **[Brand](./brand.html)** of assets. |
| [AmountValue](./ertp-data-types.html#amountvalue) | Describes how much of something there is. |
| [AssetKind](./ertp-data-types.html#assetkind) | Specifies whether an **Amount** is fungible or non-fungible. |
| [DisplayInfo](./ertp-data-types.html#displayinfo) | Specifies how to display a **Brand**'s **Amounts**. |

