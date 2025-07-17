// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const EcoRewardSystemModule = buildModule("EcoRewardSystem", (m) => {
  // Deploy EcoToken first
  const ecoToken = m.contract("EcoToken");
  
  // Deploy EcoActionNFT
  const ecoActionNFT = m.contract("EcoActionNFT");
  
  // Define predefined governors (replace with actual addresses)
  const predefinedGovernors = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Replace with actual governor address
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Replace with actual governor address
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"  // Replace with actual governor address
  ];
  
  // Deploy EcoRewardSystem with dependencies
  const ecoRewardSystem = m.contract("EcoRewardSystem", [
    ecoToken,
    ecoActionNFT,
    predefinedGovernors
  ]);

  // Transfer ownership of EcoToken to EcoRewardSystem
  m.call(ecoToken, "transferOwnership", [ecoRewardSystem]);
  
  // Transfer ownership of EcoActionNFT to EcoRewardSystem
  m.call(ecoActionNFT, "transferOwnership", [ecoRewardSystem]);

  return { 
    ecoToken,
    ecoActionNFT,
    ecoRewardSystem 
  };
});

module.exports = EcoRewardSystemModule;