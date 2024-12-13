

Sending Invitation Payments using an Address [​](#sending-invitation-payments-using-an-address)
===============================================================================================

In this document, we'll explain how to send a payment to someone using their `agoric1...` address from an Agoric smart contract using a deposit facet.

Using a depositFacet [​](#using-a-depositfacet)
-----------------------------------------------

Let's take a look at the following code snippet from the Swaparoo contract:

js
```
const secondDepositFacet = await E(depositFacetFromAddr).lookup(
  secondPartyAddress,
  'depositFacet'
);

await E(secondDepositFacet).receive(secondSeatInvitation);

return 'invitation sent';
```

Step-by-Step Explanation [​](#step-by-step-explanation)
-------------------------------------------------------

### Retrieving the Deposit Facet: [​](#retrieving-the-deposit-facet)

* `depositFacetFromAddr` is an object that provides a lookup function for deposit facets associated with addresses. The Swaparoo contract is provided with a `namesByAddressAdmin` by the proposal (`swaparoo.proposal.js`). The contract makes `depositFacetFromAddr` using `fixHub()`.
  + An example of an address might be `agoric1ydzxwh6f893jvpaslmaz6l8j2ulup9a7x8qvvq`.
* The lookup function is called with `secondPartyAddress` and `'depositFacet'` as arguments to retrieve the deposit facet associated with the `secondPartyAddress`.
* The resulting deposit facet is stored in the `secondDepositFacet` variable.

### Making the Payment: [​](#making-the-payment)

* `secondDepositFacet` represents the deposit facet obtained in the previous step.
* The `receive` method is called on `secondDepositFacet`, passing `secondSeatInvitation` as an argument.
* `secondSeatInvitation` is an Invitation to participate in the second seat (recall that invitations are payments).
* Since `receive` is another asynchronous operation, the `await` keyword is again used to wait for it to complete.
* By calling `receive` on the deposit facet with `secondSeatInvitation`, the payment represented by `secondSeatInvitation` is transferred or deposited into a purse associated with `secondDepositFacet`.

### Returning a Result: [​](#returning-a-result)

* After the payment has been successfully made by calling `receive`, the function returns the string `'invitation sent'` to indicate that the invitation has been sent.

Deposit Facets in Agoric [​](#deposit-facets-in-agoric)
-------------------------------------------------------

In the Agoric smart contract framework, deposit facets are used as a way to transfer and manage digital assets and payments between parties. By calling the receive method on a deposit facet and passing in a payment or offer, the smart contract can deposit or transfer assets into the account associated with that facet.

Deposit facets provide an abstraction layer for handling payments and ensure that the transfers are performed securely and reliably within the smart contract.

Video Walkthrough [​](#video-walkthrough)
-----------------------------------------

As you're going through this tutorial it may be helpful to watch this video walkthrough.

