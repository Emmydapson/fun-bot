const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer Address: ${deployer.address}`);

  // Replace with the actual deployed token address
  const tokenAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

  // Connect to the deployed token contract
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.attach(tokenAddress);

  // Step 1: Generate wallets for simulation
  const walletCount = 5; // Number of wallets to simulate
  const wallets = Array.from({ length: walletCount }, () => ethers.Wallet.createRandom());

  // Log wallet addresses
  console.log("Generated Wallets:");
  wallets.forEach((wallet, index) => console.log(`Wallet ${index + 1}: ${wallet.address}`));

  // Step 2: Fund wallets with tokens
  const transferAmount = ethers.parseUnits("1000", 18); // 1000 tokens per wallet
  for (const wallet of wallets) {
    const tx = await token.transfer(wallet.address, transferAmount);
    await tx.wait();
    console.log(`Transferred ${ethers.formatUnits(transferAmount, 18)} tokens to ${wallet.address}`);
  }

  // Step 3: Perform mock buy/sell transfers
  const buyAmount = ethers.parseUnits("200", 18); // 200 tokens
  const sellAmount = ethers.parseUnits("150", 18); // 150 tokens

  console.log("\nSimulating trading activity...");
  for (const [index, wallet] of wallets.entries()) {
    // Connect wallet to token contract
    const connectedWallet = token.connect(wallet.connect(ethers.provider));

    // Simulate a "buy" transfer to another wallet
    if (index + 1 < wallets.length) {
      const txBuy = await connectedWallet.transfer(wallets[index + 1].address, buyAmount);
      await txBuy.wait();
      console.log(`Wallet ${index + 1} bought ${ethers.formatUnits(buyAmount, 18)} tokens.`);
    }

    // Simulate a "sell" transfer back to the deployer
    const txSell = await connectedWallet.transfer(deployer.address, sellAmount);
    await txSell.wait();
    console.log(`Wallet ${index + 1} sold ${ethers.formatUnits(sellAmount, 18)} tokens.`);
  }

  console.log("\nTrading simulation complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during simulation:", error);
    process.exit(1);
  });
