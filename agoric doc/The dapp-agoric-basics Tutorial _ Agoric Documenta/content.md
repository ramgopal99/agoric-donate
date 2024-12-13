

The `dapp-agoric-basics` Tutorial [​](#the-dapp-agoric-basics-tutorial)
=======================================================================

Introduction [​](#introduction)
-------------------------------

In this tutorial you will install the `dapp-agoric-basics` dapp. This dapp is a collection of basic use cases for Agoric smart contracts.

* [Sell Concert Tickets Smart Contract](./sell-concert-tickets-contract-explainer.html)
* [Swaparoo Contract](./swaparoo-how-to-swap-assets-explainer.html)
* [Sending Invitation Payments using an Address](./swaparoo-making-a-payment-explainer.html)

To begin, you will need an environment with the pre-requisite components installed as outlined in the [Getting Started](./) guide. If you have already completed the Getting Started tutorial you can use the same environment.

Downloading the dapp [​](#downloading-the-dapp)
-----------------------------------------------

Pull down the dapp from Github:

bash
```
yarn create @agoric/dapp --dapp-template dapp-agoric-basics agoric-basics
```

Installing dapp components [​](#installing-dapp-components)
-----------------------------------------------------------

Next, run the `yarn install` command from the `agoric-basics` directory:

bash
```
cd agoric-basics
yarn install
```

Starting the Docker Container [​](#starting-the-docker-container)
-----------------------------------------------------------------

Start the Docker container:

bash
```
yarn start:docker
```

After a few minutes, check to make sure blocks are being produced by viewing the Docker logs:

bash
```
yarn docker:logs
```

Starting the dapp [​](#starting-the-dapp)
-----------------------------------------

Start the `dapp-agoric-basics` contract:

bash
```
yarn start:contract
```

Start the user interface:

bash
```
yarn start:ui
```

Next, open a browser and navigate to `localhost:5173`: ![Screenshot: The dapp-agoric-basics UI](/assets/dapp-agoric-basics-001.2Nc50aNm.png)

From the UI, select the 'Connect Wallet' option. Choose 'Keplr' from the 'Select your wallet' screen: dapp-agoric-basics-002 ![Screenshot: Connecting your wallet](/assets/dapp-agoric-basics-002.RiMTrdW4.png)

Approve the connection in Keplr: dapp-agoric-basics-003 ![Screenshot: Approve the connection in Keplr](/assets/dapp-agoric-basics-003.JSfVD2Mu.png)

Select a ticket to purchase and click the 'Mint` button to mint a ticket. Approve the transaction in Keplr: ![Screenshot: Approving the ticket purchase](/assets/dapp-agoric-basics-004.DcubTfuY.png)

Once the transaction has completed, you will notice the tickets in your wallet: ![Screenshot: Tickets in Keplr wallet](/assets/dapp-agoric-basics-005.CfN7RX14.png)

