const hre = require("hardhat");
const { ethers } = hre; // Explicitly reference ethers from Hardhat

console.log(hre.ethers);

async function main() {
  // Get the contract factory
  const Contract = await ethers.getContractFactory("Lock");

  // Specify an unlock time (current time + 1 minute, for example)
  const unlockTime = Math.floor(Date.now() / 1000) + 60; // 60 seconds from now

  // Deploy the contract with the unlockTime argument and send Ether
  const contract = await Contract.deploy(unlockTime, {
    value: ethers.parseEther("0.1"), // Directly call parseEther
  });

  // Wait for deployment (ethers v6 automatically resolves this)
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target); // Use `target` for address in ethers v6
  console.log("Unlock time:", unlockTime);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
