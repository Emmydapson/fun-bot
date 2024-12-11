const { ethers } = require("hardhat");

async function main() {
  const tokenName = "FunToken";
  const tokenSymbol = "FTK";
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 tokens with 18 decimals

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(tokenName, tokenSymbol, initialSupply);

  await token.waitForDeployment();

  console.log("Token deployed to:", token.target);
  console.log(`Name: ${tokenName}, Symbol: ${tokenSymbol}, Initial Supply: ${initialSupply.toString()}`);

  // Mint additional tokens (for example, mint 500,000 FTK to the deployer's address)
  const mintAmount = ethers.parseUnits("500000", 18); // 500,000 tokens
  const [deployer] = await ethers.getSigners();

  console.log("Minting tokens to deployer...");
  const tx = await token.mint(deployer.address, mintAmount); // Capture the transaction object
  await tx.wait(); // Ensure transaction is confirmed

  console.log(`Minted ${ethers.formatUnits(mintAmount, 18)} FTK to ${deployer.address}`);

  // Check and log deployer balance after minting
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("Deployer balance after mint: ", ethers.formatUnits(deployerBalance, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
