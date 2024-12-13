

Access Control with Objects [​](#access-control-with-objects)
=============================================================

In our third smart contract, we will demostrate how to control access to different functions of a smart contract. So far, we have only used `publicFacet` to expose all functions. There is an other facet, called `creatorFacet` that is provided only to the caller who creates the contract instance. In this smart contract, we limit the `publicFacet` API to a read-only function `get()`, and use `creatorFacet` API to expose the `set()` method to the caller who creates the contract instanace.

Here is the complete code for `03-access.js` smart contract:

js
```
import { Far } from '@endo/far';

export const start = () => {
  let value = 'Hello, World!';
  const get = () => value;
  const set = v => (value = v);

  return {
    publicFacet: Far('ValueView', { get }),
    creatorFacet: Far('ValueCell', { get, set }),
  };
};
```

We can write a simple test as below to make sure that trying to `set` using the `publicFacet` throws an exception, but using the `creatorFacet` works:

js
```
test('access control', async t => {
  const { publicFacet, creatorFacet } = access.start();
  t.is(await E(publicFacet).get(), 'Hello, World!');
  await t.throwsAsync(E(publicFacet).set(2), { message: /no method/ });
  await E(creatorFacet).set(2);
  t.is(await E(publicFacet).get(), 2);
});
```

Note that the `set()` method has no access check inside it. Access control is based on separation of powers between the `publicFacet`, which is expected to be [shared widely](/guides/js-programming/hardened-js.html#widely-shared-capabilities), and the `creatorFacet`, which is [closely held](/guides/js-programming/hardened-js.html#closely-held-capabilities). *We'll discuss this [object capabilities](./../js-programming/hardened-js.html#object-capabilities-ocaps) approach more later.* If you're having trouble, check out the [`tut-03-access`](https://github.com/Agoric/dapp-offer-up/tree/tut-03-access) branch in the example repo.

Object Access Rules [​](#object-access-rules)
---------------------------------------------

The object access rules include introduction, parenthood, endowment, and initial conditions, which help manage and control access to objects within the contract:

* **Introduction**: Objects can only reference other objects that they have been introduced to. This prevents unauthorized access by ensuring that only known objects can interact.
* **Parenthood**: Objects can create child objects. The parent object has control over the child object’s initial state and capabilities, defining what the child can and cannot do.
* **Endowment**: Objects can be endowed with certain capabilities or resources upon creation. This allows the contract to control what actions an object can perform based on its endowments.
* **Initial Conditions**: Objects are initialized with certain conditions or states. These initial conditions define the starting point for the object’s behavior and interactions.

Also see [Object Capability Model](https://en.wikipedia.org/wiki/Object-capability_model)

Next, let's look at minting and trading assets with [Zoe](./../zoe/).

