

The Agoric Platform [​](#the-agoric-platform)
=============================================

![agoric stack](/assets/stack.CM1htLI4.svg)

This document focuses on the layers beneath Zoe and ERTP, what we call the Agoric Platform. This includes "SwingSet", which can be thought of as our VM providing a distributed Javascript environment, as well as the Cosmos SDK and IBC.

SwingSet [​](#swingset)
-----------------------

On a single blockchain, or even a single machine with multiple users, it's very important to ensure that one user cannot prevent another user's code from executing and that the way in which code is interleaved doesn't open up hazards such as reentrancy. SwingSet solves that problem by dividing up the execution environment into *vats*. A [vat](./../js-programming/#vats-the-unit-of-synchrony) is a *unit of synchrony*. This means that within a JavaScript vat, objects and functions can communicate with one another synchronously. Between vats, objects and functions communicate asynchronously, by design.

A physical machine can run one or several vats. A blockchain can run one or several communicating vats.

The internal state of a vat can be stored in a persistent memory so that the vat can be turned off and later turned back on (on the same or a different physical machine) by loading the stored state.

A SwingSet instance also handles communication between the vats it provides and the outside world. On a blockchain, this means writing to a part of the state that is intended to serve as an outbox. On a non-blockchain machine, this might mean sending a message to a remote machine.

SwingSet provides [orthogonal persistence](https://en.wikipedia.org/wiki/Persistence_(computer_science)#Orthogonal_or_transparent_persistence).

Cosmos SDK [​](#cosmos-sdk)
---------------------------

Our testnet has a single SwingSet instance with multiple vats running on top of Cosmos SDK. SwingSet and most of our code is written in JavaScript, so we currently have a complicated process that starts up the JavaScript environment, starts a SwingSet instance, and then connects through Go to the Cosmos SDK modules, the consensus algorithm in Tendermint, and back again.

Dynamic IBC [​](#dynamic-ibc)
-----------------------------

IBC is the protocol for [Inter-Blockchain Communication](https://cosmos.network/ibc/). IBC enables messages to be sent from one blockchain to another with the use of intermediary relayers.

Dynamic IBC (dIBC) is a solution to the problem of rolling out a new protocol without needing a platform upgrade or chain governance vote.

In essence, dIBC is the idea of using a smart contract or VM platform to deploy new contracts that support new protocols, all on an existing chain without having to wait for chain upgrades.

For more information, check out [a recent article on dIBC](https://medium.com/agoric/the-road-to-dynamic-ibc-4a43bc964bca).

Tendermint [​](#tendermint)
---------------------------

Tendermint is a consensus engine, defining how blocks are agreed upon and created. Effectively, Tendermint is the lowest level layer that defines the blockchain itself.

