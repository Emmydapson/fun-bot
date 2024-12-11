const { ethers } = require("hardhat");

async function main() {
  // Take user input for token details (or use defaults)
  const tokenName = process.env.TOKEN_NAME || "CustomToken"; // e.g., via .env or prompt
  const tokenSymbol = process.env.TOKEN_SYMBOL || "CTK";
  const initialSupply = ethers.parseUnits(process.env.INITIAL_SUPPLY || "1000000", 18); // Default: 1,000,000 tokens

  console.log("Deploying token with the following details:");
  console.log(`Name: ${tokenName}`);
  console.log(`Symbol: ${tokenSymbol}`);
  console.log(`Initial Supply: ${ethers.formatUnits(initialSupply, 18)}`);

  // Get deployer wallet
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract...");
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(tokenName, tokenSymbol, initialSupply);

  await token.waitForDeployment(); // Correct function to await deployment
  console.log(`Token deployed to: ${token.target}`);

  // Optional: Mint additional tokens
  const additionalMint = ethers.parseUnits(process.env.ADDITIONAL_MINT || "0", 18);
  if (additionalMint > 0n) { // Use BigInt comparison
    console.log(`Minting ${ethers.formatUnits(additionalMint, 18)} tokens to deployer...`);
    const mintTx = await token.mint(deployer.address, additionalMint);
    await mintTx.wait();
    console.log("Minting complete.");
  }

  // Log final deployer balance
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("Deployer balance after deployment and minting:", ethers.formatUnits(deployerBalance, 18));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying token:", error);
    process.exit(1);
  });
