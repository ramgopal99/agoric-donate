

State Smart Contract [​](#state-smart-contract)
===============================================

In our first `hello-world` smart contract, we created a `greet` function and exposed it using `publicFacet` so that it can be remotely called. However, if you notice, there is no state in our smart contract that is preserved between calls. Contracts can use ordinary variables and data structures for state.

In our second example smart contract, we will manage a list of rooms. We want everyone with access to `publicFacet` to be able to create a new room, and also get current count of rooms. We maintain state using `Map` data structure as below:

js
```
const rooms = new Map();
```

Anyone can add new rooms by making a call to `makeRoom` which is defined as:

js
```
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

Using `makeRoom` creates a new room, exposing these functions to be invoked on the newly added room, `getId`, `incr`, and `decr`. As you can see this pattern follows the `Object Capability model`, as whoever receives the room by invoking `makeRoom`, will now have access to these three methods. Following this, `rooms.set(id, room)` adds the newly created room, into the contract's map state variable. A call to `getRoomCount` function returns the number of rooms in this map.

js
```
const getRoomCount = () => rooms.size;
```

Putting it all together:

js
```
import { Far } from '@endo/far';

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

  return {
    publicFacet: Far('RoomMaker', { getRoomCount, makeRoom }),
  };
};
```

Let us save this contract as `02-state.js` and creating a simple test to validate its functionality:

js
```
test('state', async t => {
  const { publicFacet } = state.start();
  const actual = await E(publicFacet).getRoomCount();
  t.is(actual, 0);
  await E(publicFacet).makeRoom(2);
  t.is(await E(publicFacet).getRoomCount(), 1);
});
```

This test asserts that in the beginning the number of rooms is zero and after a call to `makeRoom`, the number of rooms changes to one. If you're having trouble, check out the [`tut-02-state`](https://github.com/Agoric/dapp-offer-up/tree/tut-02-state) branch in the example repo.

Heap state is persistent

Ordinary heap state persists between contract invocations.

We'll discuss more explicit state management for large numbers of objects (*virtual objects*) and objects that last across upgrades ([durable objects](./contract-upgrade.html#durability)) later.

