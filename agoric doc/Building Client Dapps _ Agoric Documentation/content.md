

Building Client Dapps [​](#building-client-dapps)
=================================================

The [Agoric Platform](./../platform/) consists of smart contracts and services such as [Zoe](./../zoe/) running in a [Hardened JavaScript](./../js-programming/hardened-js.html) VM running on top of a Cosmos SDK consensus layer. Clients interact with the consensus layer by making queries and submitting messages in signed transactions. In the Smart Wallet Architecture, dapps consist of

* Hardened JavaScript smart contracts
* clients that can submit offers and query status via the consensus layer

![smart wallet dapp sequence diagram](/assets/sw-dapp-arch.B8wzolkZ.svg)

1. A client formats an offer, signs it, and broadcasts it.
2. The offer is routed to the `walletFactory` contract, which finds (or creates) the `smartWallet` object associated with the signer's address and uses it to execute the offer.
3. The `smartWallet` calls `E(zoe).offer(...)` and monitors the status of the offer, emitting it for clients to query.
4. Zoe escrows the payments and forwards the proposal to the contract indicated by the offer.
5. The contract tells Zoe how to reallocate assets.
6. Zoe ensures that the reallocations respect offer safety and then provides payouts accordingly.
7. The client's query tells it that the payouts are available.

Signing and Broadcasting Offers [​](#signing-and-broadcasting-offers)
---------------------------------------------------------------------

One way to sign and broadcast offers is with the `agd tx ...` command. For example:

sh
```
agd tx swingset wallet-action --allow-spend "$ACTION" \
 --chain-id=agoriclocal --from=acct1
```

Another is using a wallet signing UI such as Keplr via the [Keplr API](https://docs.keplr.app/api/).

Given sufficient care with key management, a [cosmjs SigningStargateClient](https://cosmos.github.io/cosmjs/latest/stargate/classes/SigningStargateClient.html) or any other client that can deliver a [agoric.swingset.MsgWalletSpendAction](https://github.com/Agoric/agoric-sdk/blob/mainnet1B/golang/cosmos/proto/agoric/swingset/msgs.proto#L70) to a [Cosmos SDK endpoint](https://docs.cosmos.network/main/core/grpc_rest) works.

proto
```
message MsgWalletSpendAction {
    bytes owner = 1;
    string spend_action = 2;
}
```

Querying VStorage [​](#querying-vstorage)
-----------------------------------------

[VStorage](https://github.com/Agoric/agoric-sdk/tree/master/golang/cosmos/x/vstorage#readme) (for "Virtual Storage") is a key-value store that is read-only for clients of the consensus layer. From within the JavaScript VM, it is accessed via a `chainStorage` API with a node at each key that is write-only; a bit like a `console`.

![vstorage query diagram](/assets/vstorage-brand-q.BIIH8b2r.svg)

The protobuf definition is [agoric.vstorage.Query](https://github.com/Agoric/agoric-sdk/blob/mainnet1B/golang/cosmos/proto/agoric/vstorage/query.proto#L11):

proto
```
service Query {
  // Return an arbitrary vstorage datum.
  rpc Data(QueryDataRequest) returns (QueryDataResponse) {
    option (google.api.http).get = "/agoric/vstorage/data/{path}";
  }

  // Return the children of a given vstorage path.
  rpc Children(QueryChildrenRequest)
    returns (QueryChildrenResponse) {
      option (google.api.http).get = "/agoric/vstorage/children/{path}";
  }
}
```

We can issue queries using, `agd query ...`:

sh
```
$ agd query vstorage children 'published.agoricNames'

children:
- brand
- installation
- instance
...
```

The [Agoric CLI](./../agoric-cli/) `follow` command supports vstorage query plus some of the marshalling conventions discussed below:

sh
```
$ agoric follow -lF :published.agoricNames.brand
[
  [
    "BLD",
    slotToVal("board0566","Alleged: BLD brand"),
  ],
  [
    "IST",
    slotToVal("board0257","Alleged: IST brand"),
  ],
...
]
```

VStorage Viewer

The [vstorage-viewer](https://vstorage.agoric.net/?path=published.agoricNames.oracleBrand&endpoint=https%3A%2F%2Fmain.rpc.agoric.net%3A443) is often *very* handy:

![vstorage viewer screenshot](https://github.com/user-attachments/assets/7b577b9d-e607-453a-bc28-ac6a6abb27c9)

Specifying Offers [​](#specifying-offers)
-----------------------------------------

Recall that for an agent within the JavaScript VM, [`E(zoe).offer(...)`](/reference/zoe-api/zoe.html#e-zoe-offer-invitation-proposal-paymentpkeywordrecord-offerargs) takes an `Invitation` and optionally a `Proposal` with `{ give, want, exit }`, a `PaymentPKeywordRecord`, and `offerArgs`; it returns a `UserSeat` from which we can [getPayouts()](/reference/zoe-api/user-seat.html#e-userseat-getpayouts).

![Zoe API diagram, simplified](/assets/zoe-simp.1Ml6HzzR.svg)

In the Smart Wallet architecture, a client uses an `OfferSpec` to tell its `SmartWallet` how to conduct an offer. It includes an `invitationSpec` to say what invitation to pass to Zoe. For example:

js
```
/** @type {import('@agoric/smart-wallet').InvitationSpec} */
const invitationSpec = {
  source: 'contract',
  instance,
  publicInvitationMaker: 'makeBattleInvitation',
  invitationArgs: ['troll'],
};
```

Here the `SmartWallet` calls `E(zoe).getPublicFacet(instance)` and then uses the `publicInvitationMaker` and `invitationArgs` to call the contract's public facet.

![InvitationSpec sequence diagram](/assets/inv-spec.Dn7Wi7xa.svg)

InvitationSpec Usage

Supposing `spec` is an `InvitationSpec`, its `.source` is one of:

* `purse` - to make an offer with an invitation that is already in the Invitation purse of the smart wallet and agrees with `spec` on `.instance` and `.description` properties. For example, in [dapp-econ-gov](https://github.com/Agoric/dapp-econ-gov), committee members use invitations sent to them when the committee was created.
* `contract` - the smart wallet makes an invitation by calling a method on the public facet of a specified instance: `E(E(zoe).getPublicFacet(spec.instance)[spec.publicInvitationMaker](...spec.invitationArgs)`
* `agoricContract` - for example, from [dapp-inter](https://github.com/Agoric/dapp-inter):

js
```
{
   source: 'agoricContract',
   instancePath: ['VaultFactory'],
   callPipe: [
     ['getCollateralManager', [toLock.brand]],
     ['makeVaultInvitation'],
   ],
 }
```

The smart wallet finds the instance using `E(agoricNames).lookup('instance', ...spec.instancePath)` and makes a chain of calls specified by `spec.callPipe`. Each entry in the callPipe is a `[methodName, args?]` pair used to execute a call on the preceding result. The end of the pipe is expected to return an Invitation.

* `continuing` - For example, `dapp-inter` uses the following `InvitationSpec` to adjust a vault:

js
```
{
  source: 'continuing',
  previousOffer: vaultOfferId,
  invitationMakerName: 'AdjustBalances',
}
```

In this continuing offer, the smart wallet uses the `spec.previousOffer` id to look up the `.invitationMakers` property of the result of the previous offer. It uses `E(invitationMakers)[spec.invitationMakerName](...spec.invitationArgs)` to make an invitation.

The client fills in the proposal, which instructs the `SmartWallet` to withdraw corresponding payments to send to Zoe.

js
```
/** @type {import('@agoric/smart-wallet').BridgeAction} */
const action = harden({
  method: 'executeOffer',
  offer: {
    id: 'battle7651',
    invitationSpec,
    proposal: {
      give: { Gold: AmountMath.make(brands.gold, 100n) },
    },
  },
});
```

But recall the `spend_action` field in `MsgWalletSpendAction` is a string. In fact, the expected string in this case is of the form:

js
```
t.regex(spendAction, /^{"body":"#.*","slots":\["board123","board32342"\]}$/);
const goldStuff =
  '\\"brand\\":\\"$1.Alleged: Gold Brand\\",\\"value\\":\\"+100\\"';
t.true(spendAction.includes(goldStuff));
```

We recognize `"method":"executeOffer"` and such, but `body:`, `slots:`, and `$1.Alleged: Gold Brand` need further explanation.

### Marshalling Amounts and Instances [​](#marshalling-amounts-and-instances)

Watch: Office Hours Discussion of Marshal

* [Office Hours: ... marshalling w/board ids, ... #8069](https://github.com/Agoric/agoric-sdk/discussions/8069) July 2023

To start with, amounts include `bigint`s. The `@endo/marshal` API handles those:

js
```
const m = makeMarshal(undefined, undefined, smallCaps);

const stuff = harden([1, 2, 3n, undefined, NaN]);
const capData = m.toCapData(stuff);
t.deepEqual(m.fromCapData(capData), stuff);
```

To marshal brands and instances, recall from the discussion of [marshal in eventual send](./../js-programming/eventual-send.html#e-and-marshal-a-closer-look) how remotables are marshalled with a translation table.

The [Agoric Board](/reference/repl/board.html) is a well-known name service that issues plain string identifiers for object identities and other passable *keys* (that is: passable values excluding promises and errors). Contracts and other services can use its table of identifiers as a marshal translation table:

js
```
/** @type {Record<string, Brand>} */
const brands = {
  gold: asset.gold.brand,
  victory: asset.victory.brand,
};

// explicitly register brand using the board API
const victoryBrandBoardId = await E(theBoard).getId(brands.victory);
t.is(victoryBrandBoardId, 'board0371');

// When the publishing marshaler needs a reference marker for something
// such as the gold brand, it issues a new board id.
const pubm = E(theBoard).getPublishingMarshaller();
const brandData = await E(pubm).toCapData(brands);
t.deepEqual(brandData, {
  body: `#${JSON.stringify({
    gold: '$0.Alleged: Gold Brand',
    victory: '$1.Alleged: Victory Brand',
  })}`,
  slots: ['board0592', 'board0371'],
});
```

To reverse the process, clients can mirror the on-chain board translation table by synthesizing a remotable for each reference marker received:

js
```
const makeBoardContext = () => {
  const synthesizeRemotable = (_slot, iface) =>
    Far(iface.replace(/^Alleged: /, ''), {});

  const { convertValToSlot, convertSlotToVal } = makeTranslationTable(
    slot => Fail`unknown id: ${slot}`,
    synthesizeRemotable,
  );
  const marshaller = makeMarshal(convertValToSlot, convertSlotToVal, smallCaps);

  /** Read-only board work-alike. */
  const board = harden({
    getId: convertValToSlot,
    getValue: convertSlotToVal,
  });

  return harden({
    board,
    marshaller,
    /**
     * Unmarshall capData, synthesizing a Remotable for each boardID slot.
     *
     * @type {(cd: import("@endo/marshal").CapData<string>) => unknown }
     */
    ingest: marshaller.fromCapData,
  });
};
```

Now we can take results of vstorage queries for `Data('published.agoricNames.brand')` and `Data('published.agoricNames.instance')` unmarshal ("ingest") them:

js
```
const clientContext = makeBoardContext();

const brandQueryResult = {
  body: `#${JSON.stringify({
    gold: '$1.Alleged: Gold Brand',
    victory: '$0.Alleged: Victory Brand',
  })}`,
  slots: ['board0371', 'board32342'],
};
const brands = clientContext.ingest(brandQueryResult);
const { game1: instance } = clientContext.ingest(instanceQueryResult);
```

And now we have all the pieces of the `BridgeAction` above. The marshalled form is:

js
```
t.deepEqual(clientContext.marshaller.toCapData(action), {
  body: `#${JSON.stringify({
    method: 'executeOffer',
    offer: {
      id: 'battle7651',
      invitationSpec: {
        instance: '$0.Alleged: Instance',
        invitationArgs: ['troll'],
        publicInvitationMaker: 'makeBattleInvitation',
        source: 'contract',
      },
      proposal: {
        give: {
          Gold: { brand: '$1.Alleged: Gold Brand', value: '+100' },
        },
      },
    },
  })}`,
  slots: ['board123', 'board32342'],
});
```

We still don't quite have a single string for the `spend_action` field. We need to `stringify` the `CapData`:

js
```
const spendAction = JSON.stringify(
  clientContext.marshaller.toCapData(action),
);
```

And now we have the `spend_action` in the expected form:

js
```
t.regex(spendAction, /^{"body":"#.*","slots":\["board123","board32342"\]}$/);
const goldStuff =
  '\\"brand\\":\\"$1.Alleged: Gold Brand\\",\\"value\\":\\"+100\\"';
t.true(spendAction.includes(goldStuff));
```

The wallet factory can now `JSON.parse` this string into `CapData` and unmarshal it using a board marshaller to convert board ids back into brands, instances, etc.

Smart Wallet VStorage Topics [​](#smart-wallet-vstorage-topics)
---------------------------------------------------------------

Each smart wallet has a node under `published.wallet`:

sh
```
$ agd query vstorage children published.wallet
children:
- agoric1h4d3mdvyqhy2vnw2shq4pm5duz5u8wa33jy6cl
- agoric1qx2kqqdk80fdasldzkqu86tg4rhtaufs00na3y
- agoric1rhul0rxa2z829a6xkrvuq8m8wjwekyduv7dzfj
...
```

Smart wallet clients should start by getting the **current** state at `published.${ADDRESS}.current` and then subscribe to **updates** at `published.${ADDRESS}`. For example, we can use `agoric follow -lF` to get the latest `.current` record:

sh
```
$ agoric follow -lF :published.wallet.agoric1h4d3mdvyqhy2vnw2shq4pm5duz5u8wa33jy6cl.current
{
  liveOffers: [],
  offerToPublicSubscriberPaths: [
    [
      "openVault-1691526589332",
      {
        vault: "published.vaultFactory.managers.manager0.vaults.vault2",
      },
    ],
  ],
  offerToUsedInvitation: [
    [
      "openVault-1691526589332",
      {
        brand: slotToVal("board0074","Alleged: Zoe Invitation brand"),
        value: [
          {
            description: "manager0: MakeVault",
            handle: slotToVal(null,"Alleged: InvitationHandle"),
            installation: slotToVal("board05815","Alleged: BundleIDInstallation"),
            instance: slotToVal("board00360","Alleged: InstanceHandle"),
          },
        ],
      },
    ],
  ],
  purses: [
    {
      balance: {
        brand: slotToVal("board0074"),
        value: [],
      },
      brand: slotToVal("board0074"),
    },
  ],
}
```

Then we can use `agoric follow` without any options to get a stream of updates as they appear.

sh
```
agoric follow :published.wallet.agoric1h4d3mdvyqhy2vnw2shq4pm5duz5u8wa33jy6cl
...
{
  status: {
    id: "closeVault-1691526597848",
    invitationSpec: {
      invitationMakerName: "CloseVault",
      previousOffer: "openVault-1691526589332",
      source: "continuing",
    },
    numWantsSatisfied: 1,
    payouts: {
      Collateral: {
        brand: slotToVal("board05557","Alleged: ATOM brand"),
        value: 13000000n,
      },
      Minted: {
        brand: slotToVal("board0257","Alleged: IST brand"),
        value: 215000n,
      },
    },
    proposal: {
      give: {
        Minted: {
          brand: slotToVal("board0257"),
          value: 5750000n,
        },
      },
      want: {},
    },
    result: "your vault is closed, thank you for your business",
  },
  updated: "offerStatus",
}
```

Note that status updates are emitted at several points in the handling of each offer:

* when the `getOfferResult()` promise settles
* when the `numWantsSatisfied()` promise settles
* when the payouts have been deposited.

And we may get `balance` updates at any time.

The data published via vstorage are available within the JavaScript VM via the [getPublicTopics](https://github.com/Agoric/agoric-sdk/blob/mainnet1B/packages/smart-wallet/src/smartWallet.js#L585) API.

The [CurrentWalletRecord](https://github.com/Agoric/agoric-sdk/blob/mainnet1B/packages/smart-wallet/src/smartWallet.js#L71-L76) type is:

ts
```
{
   purses: Array<{brand: Brand, balance: Amount}>,
   offerToUsedInvitation: Array<[ offerId: string, usedInvitation: Amount ]>,
   offerToPublicSubscriberPaths: Array<[ offerId: string, publicTopics: { [subscriberName: string]: string } ]>,
   liveOffers: Array<[import('./offers.js').OfferId, import('./offers.js').OfferStatus]>,
}
```

And [UpdateRecord](https://github.com/Agoric/agoric-sdk/blob/mainnet1B/packages/smart-wallet/src/smartWallet.js#L80-L83) is:

ts
```
     { updated: 'offerStatus', status: import('./offers.js').OfferStatus }
   | { updated: 'balance'; currentAmount: Amount }
   | { updated: 'walletAction'; status: { error: string } }
```

Both of those types include [OfferStatus](https://github.com/Agoric/agoric-sdk/blob/mainnet1B/packages/smart-wallet/src/offers.js#L21C14-L26C5) by reference:

ts
```
import('./offers.js').OfferSpec & {
 error?: string,
 numWantsSatisfied?: number
 result?: unknown | typeof UNPUBLISHED_RESULT,
 payouts?: AmountKeywordRecord,
}
```

VBank Assets and Cosmos Bank Balances [​](#vbank-assets-and-cosmos-bank-balances)
---------------------------------------------------------------------------------

Note that balances of assets such as **IST** and **BLD** are already available via consensus layer queries to the Cosmos SDK [bank module](https://docs.cosmos.network/main/modules/bank).

sh
```
$ agd query bank balances agoric1h4d3mdvyqhy2vnw2shq4pm5duz5u8wa33jy6cl -o json | jq .balances
[
  {
    "denom": "ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA",
    "amount": "100000000"
  },
  {
    "denom": "ubld",
    "amount": "10000000"
  },
  {
    "denom": "uist",
    "amount": "215000"
  }
]
```

They are not published redundantly in vstorage and nor does the smart wallet emit `balance` updates for them.

To get the correspondence between certain cosmos denoms (chosen by governance) and their ERTP brands, issuers, and display info such as `decimalPlaces`, see `published.agoricNames.vbankAsset`:

sh
```
agoric follow -lF :published.agoricNames.vbankAsset
[
  [
    "ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA",
    {
      brand: slotToVal("board05557","Alleged: ATOM brand"),
      denom: "ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA",
      displayInfo: {
        assetKind: "nat",
        decimalPlaces: 6,
      },
      issuer: slotToVal("board02656","Alleged: ATOM issuer"),
      issuerName: "ATOM",
      proposedName: "ATOM",
    },
  ],
  [
    "ubld",
    {
      brand: slotToVal("board0566","Alleged: BLD brand"),
      denom: "ubld",
      displayInfo: {
        assetKind: "nat",
        decimalPlaces: 6,
      },
      issuer: slotToVal("board0592","Alleged: BLD issuer"),
      issuerName: "BLD",
      proposedName: "Agoric staking token",
    },
  ],
  [
    "uist",
    {
      brand: slotToVal("board0257","Alleged: IST brand"),
      denom: "uist",
      displayInfo: {
        assetKind: "nat",
        decimalPlaces: 6,
      },
      issuer: slotToVal("board0223","Alleged: IST issuer"),
      issuerName: "IST",
      proposedName: "Agoric stable token",
    },
  ],
...
]
```
