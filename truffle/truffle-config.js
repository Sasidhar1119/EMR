module.exports = {

  networks: {
    sepolia: {
 provider: () => new HDWalletProvider({
 mnemonic: {
 phrase: "service usual level rebel asset escape relax athlete give public invest smoke"
 },
 providerOrUrl: "https://mainnet.infura.io/v3/d668e1f742af42a0bede128326cb28fa"
 }),
 network_id: 11155111, // Sepolia's network ID
 gas: 4000000, // Adjust the gas limit as per your requirements
 gasPrice: 10000000000, // Set the gas price to an appropriate value
 confirmations: 2, // Set the number of confirmations needed for a transaction
 timeoutBlocks: 200, // Set the timeout for transactions
 skipDryRun: true // Skip the dry run option
},
    development: {
      host: "127.0.0.1",
      port: 7545,           // Ganache default port
      network_id: "*",      // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.13",    // Match your solidity version
    },
  },
};
