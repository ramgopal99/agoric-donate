

Agoric CLI Reference [​](#agoric-cli-reference)
===============================================

agoric help [​](#agoric-help)
-----------------------------

Displays the Agoric CLI commands and arguments with brief descriptions.

**Usage**:

sh
```
agoric [command]
```

By default, lists all commands:

```
  cosmos <command...>                            client for an Agoric Cosmos chain
  ibc-setup <command...>                         set up Inter Blockchain Communication
  open [options]                                 launch the Agoric UI
  init [options] <project>                       create a new Dapp directory named <project>
  set-defaults [options] <program> <config-dir>  update the configuration files for <program> in <config-dir>
  ibc-relayer                                    run an Inter Blockchain Communications relayer
  install [force-sdk-version]                    install Dapp dependencies
  follow [options] <path-spec...>                follow an Agoric Casting leader
  run <script> [script-args...]                  run a script with all your user privileges and some Agoric endowments
  deploy [options] [script...]                   run multiple scripts with all your user privileges against the local Agoric
                                                 VM
  publish [options] [bundle...]                  publish a bundle to a Cosmos chain
  wallet [options]                               wallet commands
  start [options] [profile] [args...]            start an Agoric VM
  help [command]                                 display help for command
```

agoric run [​](#agoric-run)
---------------------------

Run a script with all your user privileges and some Agoric endowments.

**Usage**:

sh
```
agoric run [options] <script> [script-args...]
```

See also:

* [`agoric run` supports bundling proposal modules with writeCoreProposal](https://github.com/Agoric/agoric-sdk/discussions/8087#discussioncomment-6534378) discussion [#8087](https://github.com/Agoric/agoric-sdk/discussions/8087) 2023-07

agoric follow [​](#agoric-follow)
---------------------------------

Follow an Agoric (Casting)[<https://www.npmjs.com/package/@agoric/casting>] leader (or validator) to support vstorage query along with some of the marshalling conventions.

**Usage**:

sh
```
agoric follow [options] <path-spec...>
```

**Optional arguments**:

* **--proof <strict | optimistic | none>**: set proof mode (default: "optimistic")
* **--sleep <seconds>**: sleep `seconds>` between polling (may be fractional) (default: 5)
* **--jitter <max-seconds>**: jitter up to `<max-seconds>` (may be fractional) (default: 5)
* **-F, --first-value-only**: only display the first value of each `<path-spec>`
* **-o, --output <format>**: value output format (default: "justin")
* **-l, --lossy**: show only the most recent value for each sample interval
* **-b, --block-height**: show first block height when each value was stored
* **-c, --current-block-height**: show current block height when each value is reported
* **-B, --bootstrap <config>**: network bootstrap configuration
* **-h, --help**: display help for command

**Examples**:

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

~~agoric init~~ [​](#agoric-init)
---------------------------------

*Deprecated in favor of [yarn create @agoric/dapp](./../getting-started/#creating-your-dapp-from-a-template)*

Creates a new dapp directory named `<project>` with contents copied from the `dapp-template` argument template.

**Usage**:

```
agoric init [options] <project>
```

* **projectName**: Name of the new project to initialize.

**Optional arguments**:

* **--dapp-template <name>**: Use the template specified by `<name>`. If this argument isn't passed, then the default dapp `dapp-fungible-faucet` is used.
* **--dapp-base <base-url>**: The location where the dapp template can be found. If this argument isn't passed, then the default value of `git://github.com/Agoric/` is used.
* **-V**, **--version**: Outputs the version number.
* **--docker-tag <tag>**: Uses the specified tag of any started Docker containers. Defaults to `latest`.
* **--sdk**: Uses the Agoric SDK containing this program.
* **-v**, **--verbose**: Causes the command to be run in verbose mode.
* **-h**, **--help**: Displays help for the command.

**Examples**:

```
agoric init demo
```

Creates a directory named "demo" with contents copied from the default dapp-template *dapp-fungible-faucet*.

```
agoric init my-first-contract --dapp-template dapp-simple-exchange
```

Creates a directory named *my-first-contract* with contents copied from the dapp-template *dapp-simple-exchange*.

```
agoric init my-contract --dapp-template dapp-skeleton --dapp-base file:///home/contracts
```

Creates a directory named *my-contract* with contents copied from a dapp-template named *dapp-skeleton* located under the URL *file:///home/contracts*.

~~agoric install~~ [​](#agoric-install)
---------------------------------------

*Deprecated*

Installs dapp JavaScript dependencies. This may take a while. You use this instead of established npm install tools. The reason is that there is both an SDK (`--sdk`) and NPM mode. Currently we only support SDK mode, which allows you to link your dapp against the SDK dependencies. This allows you to modify any package in the SDK against the SDK dependencies (and see the changes) without having to register those packages with Yarn or NPM.

**Syntax**:

```
agoric install <optional arguments>
```

**Optional arguments**:

* **-V**, **--version**: Outputs the version number.
* **--docker-tag <tag>**: Uses the specified tag of any started Docker containers. Defaults to `latest`.
* **--sdk**: Uses the Agoric SDK containing this program.
* **-v**, **--verbose**: Causes the command to be run in verbose mode.
* **-h**, **--help**: Displays help for the command.

agoric start local-chain [​](#agoric-start-local-chain)
-------------------------------------------------------

**Usage**:

```
agoric start local-chain [portNum] -- [initArgs] - local chain

Options:
  --reset                      clear all VM state before starting
  --no-restart                 do not actually start the VM
  --pull                       for Docker-based VM, pull the image before running
  --rebuild                    rebuild VM dependencies before running
  -h, --help                   display help for command
```

~~agoric start~~ [​](#agoric-start)
-----------------------------------

*Deprecated: Beta Feature*

Runs an Agoric VM on which contracts can run.

**Syntax**:

```
agoric start <optional arguments>
```

**Optional arguments**:

* **profile**: Specifies the environment for the VM. Setting this argument to `testnet` connects the VM to our current testnet. If this argument isn't passed, then the default value of `dev` (representing the development mode) is used.
* **--reset**: Clears all VM state before starting.
* **--pull**: For Docker-based VMs, pulls the images before running.
* **--delay [seconds]**: Accounts for processing time in the simulated chain by delaying each round-trip to it by the specified number of seconds. The default value is `1`, which lets you easily count the number of trips in your head. If this argument isn't passed, then the seconds of delay will be set from the numeric value of the FAKE\_CHAIN\_DELAY environment variable (or zero if there is no such variable).
* **--inspect [host[:port]]**: Activates inspector on host:port. The default value is "127.0.0.1:9229".
* **--inspect-brk [host[:port]]**: Activates inspector on host:port and breaks at start of script. The default value is "127.0.0.1:9229".
* **-V**, **--version**: Outputs the version number.
* **--docker-tag <tag>**: Uses the specified tag of any started Docker containers. Defaults to `latest`.
* **--sdk**: Uses the Agoric SDK containing this program.
* **-v**, **--verbose**: Causes the command to be run in verbose mode.
* **-h**, **--help**: Displays help for the command.

**Examples**:

```
agoric start --reset
```

Restarts the Agoric VM, clearing all existing state before doing so.

```
agoric start --pull
```

Before running docker-based VMs, pulls the image.

```
agoric start --delay 5
```

Configures a 5 second processing time for each round-trip to the simulated chain.

~~agoric deploy~~ [​](#agoric-deploy)
-------------------------------------

*Deprecated: Beta Feature*

Runs one or more deployment scripts against the local Agoric VM. You may optionally specify which host and port to connect to the VM on.

**Syntax**:

```
agoric deploy <optional arguments>
```

**Optional arguments**:

* **Positional Arguments**:
  + `<script...>`: Deployment script(s) to run against the local Agoric instance. You must specify at least one, and may specify more than one.
* **Options**:
  + `--hostport <HOST:PORT>`: Host and port on which to connect to the VM.
  + `-h`, `--help`: Display help for `deploy` command

**Examples**:

```
agoric init demo
```

Creates a directory named "demo" with contents copied from the default dapp-template *dapp-fungible-faucet*.

```
agoric init my-first-contract --dapp-template dapp-simple-exchange
```

Creates a directory named *my-first-contract* with contents copied from the dapp-template *dapp-simple-exchange*.

```
agoric init my-contract --dapp-template dapp-skeleton --dapp-base file:///home/contracts
```

Creates a directory named *my-contract* with contents copied from a dapp-template named *dapp-skeleton* located under the URL *file:///home/contracts*.

* **Examples**:
  + Run the specified `deploy.js` scripts against the local Agoric VM.
    - `agoric deploy ./contract/deploy.js ./api/deploy.js`
  + Run the specified `deploy.js` scripts on VM host 128.7.3.139 and port 99.
    - `agoric deploy --hostport 128.7.3.139:99 ./contract/deploy.js`

~~agoric open~~ [​](#agoric-open)
---------------------------------

*Deprecated: Beta Feature*

Launches the Agoric UI. By default, only the UI is shown, not the REPL (Read-Eval-Print-Loop). To show both the UI and REPL, or only the REPL, see the `--repl` optional argument below.

**Syntax**:

```
agoric open <optional arguments>
```

**Optional arguments**:

* **Positional Arguments**
  + None
* **Options**
  + `--hostport <host:port>`: Host and port on which to connect to the VM (default: "127.0.0.1:8000").
  + `--no-browser`: Display the UI's URL, but don't open a browser.
  + `--repl [yes | only | no]`: Whether to show the Read-Eval-Print loop. Defaults to `yes` if specified (see Examples below)
  + `-h`, `--help`: Display help for `open` command.

**Examples**:

```
agoric init demo
```

Creates a directory named "demo" with contents copied from the default dapp-template *dapp-fungible-faucet*.

```
agoric init my-first-contract --dapp-template dapp-simple-exchange
```

Creates a directory named *my-first-contract* with contents copied from the dapp-template *dapp-simple-exchange*.

```
agoric init my-contract --dapp-template dapp-skeleton --dapp-base file:///home/contracts
```

Creates a directory named *my-contract* with contents copied from a dapp-template named *dapp-skeleton* located under the URL *file:///home/contracts*.

* **Examples**
  + Launch only the Agoric UI in a browser
    - `agoric open`
  + Display the Agoric UI's URL, but don't open it in a browser.
    - `agoric open --no-browser`
  + Display only the REPL for the Agoric UI in a browser.
    - `agoric open --repl only`
  + Display both the Agoric UI and the REPL in a browser (`--repl` defaults to `yes`).
    - `agoric open --repl`
