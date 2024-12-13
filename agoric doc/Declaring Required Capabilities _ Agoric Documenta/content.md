

Declaring Required Capabilities [​](#declaring-required-capabilities)
=====================================================================

Most contract deployments don't need everything in `BootstrapPowers`. Verifying by inspection that they don't use any more than they need is notoriously difficult. So proposals come with a `BootstrapManifestPermit` to declare an upper limit on the capabilities they access. For a property access `powers.P`, if the permit has `{ P: true }`, then the access succeeds. In fact, any *truthy* value will do. And recursively, a property access `powers.P.Q.R` succeeds if the permit has `{ P: { Q: { R: true } } }`.

The permit for `startSellConcertTicketsContract` is:

js
```
/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifestPermit } */
export const permit = harden({
  consume: {
    agoricNames: true,
    brandAuxPublisher: true,
    startUpgradable: true, // to start contract and save adminFacet
    zoe: true // to get contract terms, including issuer/brand
  },
  installation: {
    consume: { [contractName]: true },
    produce: { [contractName]: true }
  },
  instance: { produce: { [contractName]: true } },
  issuer: { consume: { IST: true }, produce: { Ticket: true } },
  brand: { consume: { IST: true }, produce: { Ticket: true } }
});

export const main = startSellConcertTicketsContract;
```

Selected BootstrapPowers [​](#selected-bootstrappowers)
-------------------------------------------------------

In the top level promise space, we have:

* **agoricNames**: read-only access to the [agoricNames](./../integration/name-services.html#agoricnames-agoricnamesadmin-well-known-names) name service.
* **agoricNamesAdmin**: admin / update access to [agoricNames](./../integration/name-services.html#agoricnames-agoricnamesadmin-well-known-names) and the name hubs it contains. **Warning: this includes the right to over-write existing bindings to instances, brands, etc.**
* **bankManager**: to manage reflection of cosmos assets as ERTP assets: to register an issuer to correspond to a denom or to get a bank of purses for any address. **Warning: this includes the right to spend assets for any account.**
* **board**: the [board](./../integration/name-services.html#the-board-publishing-under-arbitrary-names) name service. **Note: the board only grows; no mechanism to reclaim storage has been established.**
* **chainStorage**: to make storage nodes to [write to vstorage](./../zoe/pub-to-storage.html). **Warning: this includes access to over-write previously allocated storage nodes.**
* **chainTimerService**: for getting the current timer and setting timer wake-ups; for example, at the conclusion of a governance vote. See [Timer Service API](/reference/repl/timerServices.html). **Note: this includes access to schedule infinitely repeating events.**
* **namesByAddress**: for [looking up objects published under an address](./../integration/name-services.html#namesbyaddress-namesbyaddressadmin-and-depositfacet-per-account-namespace); in particular, a `depositFacet`.
* **namesByAddressAdmin**: admin (write) access to **namesByAddress**. **Warning: this includes access to re-direct where payments to an address go.**
* **priceAuthority**: access to get price quotes and triggers; see [Price Authority Guide](./../zoe/price-authority.html).
* **priceAuthorityAdmin**: access to add and replace sources of price quotes using [E(priceAuthorityAdmin).registerPriceAuthority()](/reference/zoe-api/price-authority-admin.html#e-priceauthorityregistryadmin-registerpriceauthority-priceauthority-brandin-brandout-force)
* **zoe**: the [Zoe service](/reference/zoe-api/zoe.html)
