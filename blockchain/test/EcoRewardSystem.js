const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EcoRewardSystem", function () {
    let ecoToken, ecoActionNFT, ecoRewardSystem;
    let owner, protector1, protector2, verifier1, verifier2, governor1, governor2;
    let accounts;

    const VERIFIER_STAKE_AMOUNT = ethers.parseEther("50");
    const REWARD_AMOUNT = ethers.parseEther("10");
    const VOTING_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds

    beforeEach(async function () {
        // Get signers
        accounts = await ethers.getSigners();
        [owner, protector1, protector2, verifier1, verifier2, governor1, governor2] = accounts;

        // Deploy EcoToken
        const EcoToken = await ethers.getContractFactory("EcoToken");
        ecoToken = await EcoToken.deploy();
        await ecoToken.waitForDeployment();

        // Deploy EcoActionNFT
        const EcoActionNFT = await ethers.getContractFactory("EcoActionNFT");
        ecoActionNFT = await EcoActionNFT.deploy();
        await ecoActionNFT.waitForDeployment();

        // Deploy EcoRewardSystem with predefined governors
        const EcoRewardSystem = await ethers.getContractFactory("EcoRewardSystem");
        ecoRewardSystem = await EcoRewardSystem.deploy(
            await ecoToken.getAddress(),
            await ecoActionNFT.getAddress(),
            [governor1.address, governor2.address]
        );
        await ecoRewardSystem.waitForDeployment();

        // Transfer ownership of EcoToken and EcoActionNFT to EcoRewardSystem
        await ecoToken.transferOwnership(await ecoRewardSystem.getAddress());
        await ecoActionNFT.transferOwnership(await ecoRewardSystem.getAddress());

        // Distribute tokens to verifiers so they can stake
        const tokenAmount = ethers.parseEther("100"); // Give each verifier 100 tokens
        await ecoToken.transfer(verifier1.address, tokenAmount);
        await ecoToken.transfer(verifier2.address, tokenAmount);
        await ecoToken.transfer(protector1.address, tokenAmount); // Also give some to protectors
        await ecoToken.transfer(protector2.address, tokenAmount);
    });

    describe("Token Distribution and Initial Setup", function () {
        it("Should have correct initial token supply", async function () {
            const expectedSupply = ethers.parseEther("1000000");
            expect(await ecoToken.totalSupply()).to.equal(expectedSupply);
        });

        it("Should distribute tokens to verifiers", async function () {
            expect(await ecoToken.balanceOf(verifier1.address)).to.equal(ethers.parseEther("100"));
            expect(await ecoToken.balanceOf(verifier2.address)).to.equal(ethers.parseEther("100"));
        });

        it("Should set up governors correctly", async function () {
            expect(await ecoRewardSystem.isGovernor(governor1.address)).to.be.true;
            expect(await ecoRewardSystem.isGovernor(governor2.address)).to.be.true;
            expect(await ecoRewardSystem.getGovernorCount()).to.equal(2);
        });
    });

    describe("Protector Registration", function () {
        it("Should allow users to register as protectors", async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
            expect(await ecoRewardSystem.protectors(protector1.address)).to.be.true;
        });

        it("Should not allow duplicate protector registration", async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
            await expect(ecoRewardSystem.connect(protector1).registerProtector())
                .to.be.revertedWith("Already registered as protector");
        });
    });

    describe("Verifier Staking", function () {
        beforeEach(async function () {
            // Register as protectors first
            await ecoRewardSystem.connect(verifier1).registerProtector();
            await ecoRewardSystem.connect(verifier2).registerProtector();
        });

        it("Should allow protectors to stake and become verifiers", async function () {
            // Approve tokens for staking
            await ecoToken.connect(verifier1).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            
            await ecoRewardSystem.connect(verifier1).stakeToVerify();
            
            expect(await ecoRewardSystem.verifiers(verifier1.address)).to.be.true;
            expect(await ecoRewardSystem.stakedAmount(verifier1.address)).to.equal(VERIFIER_STAKE_AMOUNT);
        });

        it("Should not allow non-protectors to stake", async function () {
            const nonProtector = accounts[5];
            await ecoToken.transfer(nonProtector.address, ethers.parseEther("100"));
            await ecoToken.connect(nonProtector).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            
            await expect(ecoRewardSystem.connect(nonProtector).stakeToVerify())
                .to.be.revertedWith("Must be a protector first");
        });

        it("Should allow verifiers to unstake", async function () {
            await ecoToken.connect(verifier1).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoRewardSystem.connect(verifier1).stakeToVerify();
            
            const balanceBefore = await ecoToken.balanceOf(verifier1.address);
            await ecoRewardSystem.connect(verifier1).unstakeVerifier();
            
            expect(await ecoRewardSystem.verifiers(verifier1.address)).to.be.false;
            expect(await ecoToken.balanceOf(verifier1.address)).to.equal(balanceBefore + VERIFIER_STAKE_AMOUNT);
        });
    });

    describe("Proposal Submission", function () {
        beforeEach(async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
        });

        it("Should allow protectors to submit proposals", async function () {
            await ecoRewardSystem.connect(protector1).submitProposal(
                "Solar Panel Installation",
                "Installed 5kW solar panel system",
                "QmTestHash123",
                5000 // 5kg CO2 offset
            );

            const proposal = await ecoRewardSystem.getProposal(1);
            expect(proposal.protector).to.equal(protector1.address);
            expect(proposal.actionType).to.equal("Solar Panel Installation");
            expect(proposal.carbonOffset).to.equal(5000);
        });

        it("Should not allow non-protectors to submit proposals", async function () {
            const nonProtector = accounts[5];
            await expect(ecoRewardSystem.connect(nonProtector).submitProposal(
                "Test Action",
                "Test Description",
                "QmTestHash",
                1000
            )).to.be.revertedWith("Must be a registered protector");
        });
    });

    describe("Voting System", function () {
        let proposalId;

        beforeEach(async function () {
            // Setup protectors and verifiers
            await ecoRewardSystem.connect(protector1).registerProtector();
            await ecoRewardSystem.connect(verifier1).registerProtector();
            await ecoRewardSystem.connect(verifier2).registerProtector();

            // Setup verifiers
            await ecoToken.connect(verifier1).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoToken.connect(verifier2).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoRewardSystem.connect(verifier1).stakeToVerify();
            await ecoRewardSystem.connect(verifier2).stakeToVerify();

            // Submit a proposal
            await ecoRewardSystem.connect(protector1).submitProposal(
                "Tree Planting",
                "Planted 10 trees in local park",
                "QmTreeHash456",
                10000
            );
            proposalId = 1;
        });

        it("Should allow verifiers to vote", async function () {
            await ecoRewardSystem.connect(verifier1).vote(proposalId, true);
            
            const proposal = await ecoRewardSystem.getProposal(proposalId);
            expect(proposal.yesVotes).to.equal(1);
            expect(await ecoRewardSystem.hasVoted(proposalId, verifier1.address)).to.be.true;
        });

        it("Should allow governors to vote", async function () {
            await ecoRewardSystem.connect(governor1).governorVote(proposalId, true);
            
            const proposal = await ecoRewardSystem.getProposal(proposalId);
            expect(proposal.governorYesVotes).to.equal(1);
            expect(await ecoRewardSystem.governorHasVoted(proposalId, governor1.address)).to.be.true;
        });

        it("Should not allow duplicate voting", async function () {
            await ecoRewardSystem.connect(verifier1).vote(proposalId, true);
            await expect(ecoRewardSystem.connect(verifier1).vote(proposalId, false))
                .to.be.revertedWith("Already voted");
        });

        it("Should not allow voting after deadline", async function () {
            // Fast forward time beyond voting period
            await ethers.provider.send("evm_increaseTime", [VOTING_PERIOD + 1]);
            await ethers.provider.send("evm_mine");

            await expect(ecoRewardSystem.connect(verifier1).vote(proposalId, true))
                .to.be.revertedWith("Voting period ended");
        });
    });

    describe("Proposal Execution", function () {
        let proposalId;

        beforeEach(async function () {
            // Setup accounts
            await ecoRewardSystem.connect(protector1).registerProtector();
            await ecoRewardSystem.connect(verifier1).registerProtector();
            await ecoRewardSystem.connect(verifier2).registerProtector();

            await ecoToken.connect(verifier1).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoToken.connect(verifier2).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoRewardSystem.connect(verifier1).stakeToVerify();
            await ecoRewardSystem.connect(verifier2).stakeToVerify();

            // Submit proposal
            await ecoRewardSystem.connect(protector1).submitProposal(
                "Bike Commuting",
                "Biked to work for 30 days",
                "QmBikeHash789",
                15000
            );
            proposalId = 1;
        });

        it("Should execute approved proposals and distribute rewards", async function () {
            // Vote yes
            await ecoRewardSystem.connect(verifier1).vote(proposalId, true);
            await ecoRewardSystem.connect(verifier2).vote(proposalId, true);
            await ecoRewardSystem.connect(governor1).governorVote(proposalId, true);

            // Fast forward past voting period
            await ethers.provider.send("evm_increaseTime", [VOTING_PERIOD + 1]);
            await ethers.provider.send("evm_mine");

            const protectorBalanceBefore = await ecoToken.balanceOf(protector1.address);
            const nftBalanceBefore = await ecoActionNFT.balanceOf(protector1.address);

            await ecoRewardSystem.executeProposal(proposalId);

            const proposal = await ecoRewardSystem.getProposal(proposalId);
            expect(proposal.executed).to.be.true;
            expect(proposal.approved).to.be.true;

            // Check rewards
            expect(await ecoToken.balanceOf(protector1.address)).to.equal(protectorBalanceBefore + REWARD_AMOUNT);
            expect(await ecoActionNFT.balanceOf(protector1.address)).to.equal(nftBalanceBefore + 1n);
        });

        it("Should not distribute rewards for rejected proposals", async function () {
            // Vote no
            await ecoRewardSystem.connect(verifier1).vote(proposalId, false);
            await ecoRewardSystem.connect(verifier2).vote(proposalId, false);

            // Fast forward past voting period
            await ethers.provider.send("evm_increaseTime", [VOTING_PERIOD + 1]);
            await ethers.provider.send("evm_mine");

            const protectorBalanceBefore = await ecoToken.balanceOf(protector1.address);
            await ecoRewardSystem.executeProposal(proposalId);

            const proposal = await ecoRewardSystem.getProposal(proposalId);
            expect(proposal.executed).to.be.true;
            expect(proposal.approved).to.be.false;

            // No rewards should be distributed
            expect(await ecoToken.balanceOf(protector1.address)).to.equal(protectorBalanceBefore);
        });

        it("Should not allow execution before voting period ends", async function () {
            await expect(ecoRewardSystem.executeProposal(proposalId))
                .to.be.revertedWith("Voting still active");
        });
    });

    describe("View Functions", function () {
        beforeEach(async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
            await ecoRewardSystem.connect(protector2).registerProtector();
        });

        it("Should return user proposals", async function () {
            await ecoRewardSystem.connect(protector1).submitProposal("Action1", "Desc1", "Hash1", 1000);
            await ecoRewardSystem.connect(protector1).submitProposal("Action2", "Desc2", "Hash2", 2000);
            await ecoRewardSystem.connect(protector2).submitProposal("Action3", "Desc3", "Hash3", 3000);

            const protector1Proposals = await ecoRewardSystem.getUserProposals(protector1.address);
            const protector2Proposals = await ecoRewardSystem.getUserProposals(protector2.address);

            expect(protector1Proposals.length).to.equal(2);
            expect(protector2Proposals.length).to.equal(1);
            expect(protector1Proposals[0]).to.equal(1);
            expect(protector1Proposals[1]).to.equal(2);
            expect(protector2Proposals[0]).to.equal(3);
        });

        it("Should return active proposals", async function () {
            await ecoRewardSystem.connect(protector1).submitProposal("Action1", "Desc1", "Hash1", 1000);
            await ecoRewardSystem.connect(protector2).submitProposal("Action2", "Desc2", "Hash2", 2000);

            const activeProposals = await ecoRewardSystem.getActiveProposals();
            expect(activeProposals.length).to.equal(2);
            expect(activeProposals[0]).to.equal(1);
            expect(activeProposals[1]).to.equal(2);
        });
    });

    describe("NFT Metadata", function () {
        it("Should store correct metadata in NFT", async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
            await ecoRewardSystem.connect(verifier1).registerProtector();
            await ecoToken.connect(verifier1).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoRewardSystem.connect(verifier1).stakeToVerify();

            await ecoRewardSystem.connect(protector1).submitProposal(
                "Renewable Energy",
                "Switched to renewable energy provider",
                "QmRenewableHash",
                25000
            );

            await ecoRewardSystem.connect(verifier1).vote(1, true);
            await ecoRewardSystem.connect(governor1).governorVote(1, true);

            await ethers.provider.send("evm_increaseTime", [VOTING_PERIOD + 1]);
            await ethers.provider.send("evm_mine");

            await ecoRewardSystem.executeProposal(1);

            const metadata = await ecoActionNFT.getActionMetadata(1);
            expect(metadata.actionType).to.equal("Renewable Energy");
            expect(metadata.description).to.equal("Switched to renewable energy provider");
            expect(metadata.proofHash).to.equal("QmRenewableHash");
            expect(metadata.carbonOffset).to.equal(25000);
            expect(metadata.protector).to.equal(protector1.address);
        });
    });

    describe("Edge Cases", function () {
        it("Should handle tie votes correctly", async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
            await ecoRewardSystem.connect(verifier1).registerProtector();
            await ecoRewardSystem.connect(verifier2).registerProtector();
            
            await ecoToken.connect(verifier1).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoToken.connect(verifier2).approve(await ecoRewardSystem.getAddress(), VERIFIER_STAKE_AMOUNT);
            await ecoRewardSystem.connect(verifier1).stakeToVerify();
            await ecoRewardSystem.connect(verifier2).stakeToVerify();

            await ecoRewardSystem.connect(protector1).submitProposal("Test", "Test", "Test", 1000);

            // Create tie: 1 yes, 1 no
            await ecoRewardSystem.connect(verifier1).vote(1, true);
            await ecoRewardSystem.connect(verifier2).vote(1, false);

            await ethers.provider.send("evm_increaseTime", [VOTING_PERIOD + 1]);
            await ethers.provider.send("evm_mine");

            await ecoRewardSystem.executeProposal(1);

            const proposal = await ecoRewardSystem.getProposal(1);
            expect(proposal.approved).to.be.false; // Tie should result in rejection
        });

        it("Should handle proposal with no votes", async function () {
            await ecoRewardSystem.connect(protector1).registerProtector();
            await ecoRewardSystem.connect(protector1).submitProposal("Test", "Test", "Test", 1000);

            await ethers.provider.send("evm_increaseTime", [VOTING_PERIOD + 1]);
            await ethers.provider.send("evm_mine");

            await ecoRewardSystem.executeProposal(1);

            const proposal = await ecoRewardSystem.getProposal(1);
            expect(proposal.approved).to.be.false; // No votes should result in rejection
        });
    });
});