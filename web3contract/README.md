# Crowdfunding Platform

This project is a decentralized crowdfunding platform built with Solidity and Next.js. It allows users to create and fund campaigns using Ethereum.

## Table of Contents

- [Crowdfunding Platform](#crowdfunding-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Client Setup](#client-setup)
    - [Smart Contract Setup](#smart-contract-setup)
  - [Usage](#usage)
    - [Creating a Campaign](#creating-a-campaign)
    - [Funding a Campaign](#funding-a-campaign)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Create and manage crowdfunding campaigns
- Add tiers to campaigns with specific funding amounts
- Fund campaigns and tiers
- Withdraw funds from successful campaigns
- Request refunds for failed campaigns

## Installation

### Prerequisites

- Node.js
- npm or yarn
- Foundry (for Solidity development)

### Client Setup

1. Navigate to the `client` directory:

    ```sh copy
    cd client
    ```

2. Install dependencies:

    ```sh copy
    npm install
    ```

3. Start the development server:

    ```sh copy
    npm run dev
    ```

### Smart Contract Setup

1. Navigate to the `web3contract` directory:

    ```sh copy
    cd web3contract
    ```

2. Install dependencies:

    ```sh copy
    npm install
    ```

3. Compile the smart contracts:

    ```sh copy
    forge build
    ```

## Usage

### Creating a Campaign

1. Connect your wallet using the Connect button on the client interface.
2. Fill in the campaign details and submit the form to create a new campaign.

### Funding a Campaign

1. Browse the list of active campaigns.
2. Select a campaign and choose a tier to fund.
3. Confirm the transaction in your wallet.

## Testing

1. Navigate to the `web3contract` directory:

    ```sh copy
    cd web3contract
    ```

2. Run the tests:

    ```sh copy
    forge test -vvv
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.