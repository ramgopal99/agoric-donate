

Contract Upgrade [​](#contract-upgrade)
=======================================

The return value when starting a contract includes a capability to upgrade the contract instance. A call to [E(zoe).startInstance(...)](/reference/zoe-api/zoe.html#e-zoe-startinstance-installation-issuerkeywordrecord-terms-privateargs) returns a [kit](/guides/ertp/#method-naming-structure) of [facets](/glossary/#facet); that is a record of several objects that represent different ways to access the contract instance. The `publicFacet` and `creatorFacet` are defined by the contract. The [`adminFacet`](/reference/zoe-api/zoe.html#adminFacet) is defined by Zoe and includes methods to upgrade the contract.

Upgrade Governance

Governance of the right to upgrade is a complex topic that we cover only briefly here.

* When [BLD staker governance](https://community.agoric.com/t/about-the-governance-category/15) makes a decision to start a contract using [swingset.CoreEval](./../coreeval/), to date, the `adminFacet` is stored in the bootstrap [vat](/glossary/#vat), allowing the BLD stakers to upgrade such a contract in a later `swingset.CoreEval`.
* The `adminFacet` reference can be discarded, so that noone can upgrade the contract from within the JavaScript VM. (BLD staker governace could, in theory, change the VM itself.)
* The `adminFacet` can be managed using the [@agoric/governance](https://github.com/Agoric/agoric-sdk/tree/master/packages/governance#readme) framework; for example, using the `committee.js` contract.

Upgrading a Contract [​](#upgrading-a-contract)
-----------------------------------------------

Upgrading a contract instance means re-starting the contract using a different [code bundle](./contract-walkthru.html#bundling-a-contract). Suppose we start a contract as usual, using the bundle ID of a bundle we already sent to the chain:

js
```
const bundleID = 'b1-1234abcd...';
const installation = await E(zoe).installBundleID(bundleID);
const { instance, ... facets } = await E(zoe).startInstance(installation, ...);

// ... use facets.publicFacet, instance etc. as usual
```

If we have the `adminFacet` and the bundle ID of a new version, we can use the `upgradeContract` method to upgrade the contract instance:

js
```
const v2BundleId = 'b1-feed1234...`; // hash of bundle with new feature
const { incarnationNumber } = await E(facets.adminFacet).upgradeContract(v2BundleId);
```

The `incarnationNumber` is 1 after the 1st upgrade, 2 after the 2nd, and so on.

re-using the same bundle

Note that a "null upgrade" that re-uses the original bundle is valid, and a legitimate approach to deleting accumulated heap state.

See also `E(adminFacet).restartContract()`.

Upgradable Contracts [​](#upgradable-contracts)
-----------------------------------------------

There are a few requirements for the contract that differ from non-upgradable contracts:

1. [Upgradable Declaration](#upgradable-declaration)
2. [Durability](#durability)
3. [Kinds](#kinds)
4. [Crank](#crank)

### Upgradable Declaration [​](#upgradable-declaration)

The new code bundle declares that it supports upgrade by including a `meta` record in addition to `start`. (*We used to indicate upgradability by using `prepare` instead of `start`, but that approach is deprecated.*)

`meta` is a record with any or all of `upgradability`, `customTermsShape`, and `privateArgsShape` defined. The latter two are optional [Patterns](https://endojs.github.io/endo/modules/_endo_patterns.html) restricting respectively acceptable `terms`, and `privateArgs`. `upgradability` can be `none` (the contract is not upgradable), `canUpgrade` (this code can perform an upgrade), or `canBeUpgraded` (the contract stores kinds durably such that the next version can upgrade).

js
```
export const meta = { upgradability: 'canUpgrade' };

export const start = (_zcf, _privateArgs, baggage) => {
```
### Durability [​](#durability)

The 3rd argument, `baggage`, of the `start` function is a `MapStore` that is saved by the kernel across restarts of the contract. It provides a way to preserve state and behavior of objects between incarnations in a way that also maintains the identity of objects as seen from other [vats](/glossary/#vat).

js
```
let rooms;
if (!baggage.has('rooms')) {
  // initial incarnation: create the object
  rooms = makeScalarBigMapStore('rooms', { durable: true });
  baggage.init('rooms', rooms);
} else {
  // subsequent incarnation: use the object from the initial incarnation
  rooms = baggage.get('rooms');
}
```

The `provide` function supports a concise idiom for this find-or-create pattern:

js
```
import { provide } from '@agoric/vat-data';

const rooms = provide(baggage, 'rooms', () =>
  makeScalarBigMapStore('rooms', { durable: true })
);
```

The `zone` API is a convenient way to manage durability. Its store methods integrate the `provide` pattern:

import { makeDurableZone } ...js
```
import { makeDurableZone } from '@agoric/zone/durable.js';
```
js
```
const zone = makeDurableZone(baggage);
const rooms = zone.mapStore('rooms');
```
What happens if we don't use baggage?

When the contract instance is restarted, its [vat](./../js-programming/#vats-the-unit-of-synchrony) gets a fresh heap, so [ordinary heap state](./contract-basics.html#state) does not survive upgrade. This implementation does not persist the rooms nor their counts between incarnations:

js
```
export const start = () => {
  const rooms = new Map();

  const getRoomCount = () => rooms.size;
  const makeRoom = id => {
    let count = 0;
    const room = Far('Room', {
      getId: () => id,
      incr: () => (count += 1),
      decr: () => (count -= 1),
    });
    rooms.set(id, room);
    return room;
  };
```
### Kinds [​](#kinds)

Use [`zone.exoClass()`](./contract-details.html#durable-objects) to define state and methods of kinds of durable objects such as `Room`:

js
```
const makeRoom = zone.exoClass('Room', RoomI, id => ({ id, count: 0 }), {
  getId() {
    return this.state.id;
  },
  incr() {
    this.state.count += 1;
    return this.state.count;
  },
  decr() {
    this.state.count -= 1;
    return this.state.count;
  },
});
```

Defining `publicFacet` as a singleton `exo` allows clients to continue to use it after an upgrade:

js
```
const publicFacet = zone.exo('RoomMaker', RoomMakerI, {
  makeRoom() {
    const room = makeRoom();
    const id = rooms.size;
    rooms.init(id, room);
    return room;
  },
});

return { publicFacet };
```

Now we have all the parts of an upgradable contract.

full contract listingjs
```
import { M } from '@endo/patterns';
import { makeDurableZone } from '@agoric/zone/durable.js';

const RoomI = M.interface('Room', {
  getId: M.call().returns(M.number()),
  incr: M.call().returns(M.number()),
  decr: M.call().returns(M.number()),
});

const RoomMakerI = M.interface('RoomMaker', {
  makeRoom: M.call().returns(M.remotable()),
});

export const meta = { upgradability: 'canUpgrade' };

export const start = (_zcf, _privateArgs, baggage) => {
  const zone = makeDurableZone(baggage);
  const rooms = zone.mapStore('rooms');

  const makeRoom = zone.exoClass('Room', RoomI, id => ({ id, count: 0 }), {
    getId() {
      return this.state.id;
    },
    incr() {
      this.state.count += 1;
      return this.state.count;
    },
    decr() {
      this.state.count -= 1;
      return this.state.count;
    },
  });

  const publicFacet = zone.exo('RoomMaker', RoomMakerI, {
    makeRoom() {
      const room = makeRoom();
      const id = rooms.size;
      rooms.init(id, room);
      return room;
    },
  });

  return { publicFacet };
};
```

We can then upgrade it to have another method:

js
```
const makeRoom = zone.exoClass('Room', RoomI, id => ({ id, value: 0 }), {
  // ...
  clear(delta) {
    this.state.value = 0;
  }
});
```

The interface guard also needs updating. *[The Durable objects](./contract-details.html#guards-defensive-methods) section has more on interface guards.*

js
```
const RoomI = M.interface('Room', {
  // ...
  clear: M.call().returns()
});
```

Notes

* Once the state is defined by the `init` function (3rd arg), properties cannot be added or removed.
* Values of state properties must be serializable.
* Values of state properties are hardened on assignment.
* You can replace the value of a state property (e.g. `state.zot = [...state.zot, 'last']`), and you can update stores (`state.players.set(1, player1)`), but you cannot do things like `state.zot.push('last')`, and if jot is part of state (`state.jot = { x: 1 };`), then you can't do `state.jot.x = 2;`
* The tag (1st arg) is used to form a key in `baggage`, so take care to avoid collisions. `zone.subZone()` may be used to partition namespaces.
* See also [defineExoClass](https://endojs.github.io/endo/functions/_endo_exo.defineExoClass.html) for further detail `zone.exoClass`.
* To define multiple objects that share state, use `zone.exoClassKit`.
  + See also [defineExoClassKit](https://endojs.github.io/endo/functions/_endo_exo.defineExoClassKit.html)
* For an extended test / example, see [test-coveredCall-service-upgrade.js](https://github.com/Agoric/agoric-sdk/blob/master/packages/zoe/test/swingsetTests/upgradeCoveredCall/test-coveredCall-service-upgrade.js).
### Crank [​](#crank)

Define all exo classes/kits before any incoming method calls from other vats -- in the first "crank".

Note

* For more on crank constraints, see [Virtual and Durable Objects](https://github.com/Agoric/agoric-sdk/blob/master/packages/SwingSet/docs/virtual-objects.md#virtual-and-durable-objects) in [SwingSet docs](https://github.com/Agoric/agoric-sdk/tree/master/packages/SwingSet/docs)
### Exo [​](#exo)

An Exo object is an exposed Remotable object with methods (aka a [`Far`](/guides/js-programming/far.html) object) which is normally defined with an `InterfaceGuard` as a protective outer layer, providing the first layer of defensiveness.

This [@endo/exo](https://github.com/endojs/endo/tree/master/packages/exo) package defines the APIs for making Exo objects, and for defining ExoClasses and ExoClassKits for making Exo objects.

js
```
const publicFacet = zone.exo(
  'StakeAtom',
  M.interface('StakeAtomI', {
    makeAccount: M.callWhen().returns(M.remotable('ChainAccount')),
    makeAccountInvitationMaker: M.callWhen().returns(InvitationShape)
  }),
  {
    async makeAccount() {
      trace('makeAccount');
      const holder = await makeAccountKit();
      return holder;
    },
    makeAccountInvitationMaker() {
      trace('makeCreateAccountInvitation');
      return zcf.makeInvitation(async seat => {
        seat.exit();
        const holder = await makeAccountKit();
        return holder.asContinuingOffer();
      }, 'wantStakingAccount');
    }
  }
);
```
### Zones [​](#zones)

Each [Zone](/glossary/#zone) provides an API that allows the allocation of [Exo objects](#exo) and Stores [(object collections)](https://github.com/Agoric/agoric-sdk/tree/master/packages/store/README.md) which use the same underlying persistence mechanism. This allows library code to be agnostic to whether its objects are backed purely by the JS heap (ephemeral), pageable out to disk (virtual), or can be revived after a vat upgrade (durable).

See [SwingSet vat upgrade documentation](https://github.com/Agoric/agoric-sdk/tree/master/packages/SwingSet/docs/vat-upgrade.md) for more example use of the zone API.

js
```
const zone = makeDurableZone(baggage);
// ...
zone.subZone('vows');
```
### Durable Zone [​](#durable-zone)

A zone specifically designed for durability, allowing the contract to persist its state across upgrades. This is critical for maintaining the continuity and reliability of the contract’s operations.

js
```
const zone = makeDurableZone(baggage);
```
### Vow Tools [​](#vow-tools)

See [Vow](/glossary/#vow); These tools handle promises and asynchronous operations within the contract. `prepareVowTools` prepares the necessary utilities to manage these asynchronous tasks, ensuring that the contract can handle complex workflows that involve waiting for events or responses from other chains.

js
```
const vowTools = prepareVowTools(zone.subZone('vows'));
// ...
const makeLocalOrchestrationAccountKit = prepareLocalChainAccountKit(
  zone,
  makeRecorderKit,
  zcf,
  privateArgs.timerService,
  vowTools,
  makeChainHub(privateArgs.agoricNames)
);
// ...
const makeCosmosOrchestrationAccount = prepareCosmosOrchestrationAccount(
  zone,
  makeRecorderKit,
  vowTools,
  zcf
);
```
