require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337, // Local Hardhat network
    },
    base: {
      url:"http://127.0.0.1:854", // Base Testnet RPC
      accounts: [process.env.PRIVATE_KEY], // Use your private key from the .env file
    },
  },
};
