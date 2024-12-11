// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    // Constructor that accepts an initial owner and initial supply
    constructor(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply
    ) 
        ERC20(name, symbol)
        Ownable()  // Ownable constructor is called automatically
    {
        // Mint the initial supply to the owner (deployer)
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Minting function - Only the owner (deployer) can mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
