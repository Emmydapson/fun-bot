const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.LOCALHOST_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Correct deployed token address
  const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // Correct address

  const tokenABI = [
    "function transfer(address recipient, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
    "function mint(address to, uint256 amount) public" // Mint function
  ];

  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  try {
    // Fetching the deployer's balance
    const deployerBalance = await tokenContract.balanceOf(signer.address);
    console.log(`Deployer address: ${signer.address}`);
    console.log(`Deployer balance: ${ethers.formatUnits(deployerBalance, 18)} FTK`);

    // Ensure deployerBalance is a BigNumber and compare it
    const requiredBalance = ethers.parseUnits("10", 18);

    // Compare balances by using the toString() method for BigNumber comparison
    if (deployerBalance.toString() >= requiredBalance.toString()) {
      console.log("Transferring tokens...");
      const recipient = "0x6de037e7864eed7097e6850c2d03bcaaaaec6aa6"; // Replace with actual address
      const transferAmount = ethers.parseUnits("10", 18);

      const tx = await tokenContract.transfer(recipient, transferAmount);
      await tx.wait();
      console.log(`Transferred 10 FTK to ${recipient}`);
    } else {
      console.error("Insufficient balance for transfer.");
    }

  } catch (error) {
    console.error("Error in token interaction:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
