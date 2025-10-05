const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FHEScore", function () {
  let fheScore;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const FHEScore = await ethers.getContractFactory("FHEScore");
    fheScore = await FHEScore.deploy();
    await fheScore.waitForDeployment();
  });

  describe("User Registration", function () {
    it("Should allow user registration", async function () {
      await fheScore.connect(user1).registerUser();
      expect(await fheScore.registeredUsers(user1.address)).to.be.true;
    });

    it("Should not allow duplicate registration", async function () {
      await fheScore.connect(user1).registerUser();
      await expect(
        fheScore.connect(user1).registerUser()
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Activity Submission", function () {
    beforeEach(async function () {
      await fheScore.connect(user1).registerUser();
    });

    it("Should reject activity from unregistered user", async function () {
      // Note: In a real test with FHEVM, you would need to create proper encrypted inputs
      // This is a simplified test structure
      await expect(
        fheScore.connect(user2).submitActivity(0, "0x00", "0x00")
      ).to.be.revertedWith("User not registered");
    });

    it("Should reject invalid activity type", async function () {
      await expect(
        fheScore.connect(user1).submitActivity(5, "0x00", "0x00")
      ).to.be.revertedWith("Invalid activity type");
    });
  });

  describe("Score Calculation", function () {
    beforeEach(async function () {
      await fheScore.connect(user1).registerUser();
    });

    it("Should reject score calculation from unregistered user", async function () {
      await expect(
        fheScore.connect(user2).calculateScore()
      ).to.be.revertedWith("User not registered");
    });

    it("Should allow score calculation for registered user", async function () {
      await expect(fheScore.connect(user1).calculateScore())
        .to.emit(fheScore, "ScoreCalculated")
        .withArgs(user1.address);
    });
  });

  describe("Score Retrieval", function () {
    beforeEach(async function () {
      await fheScore.connect(user1).registerUser();
      await fheScore.connect(user1).calculateScore();
    });

    it("Should allow user to get their own score", async function () {
      // In a real FHEVM environment, this would return an encrypted value
      const score = await fheScore.connect(user1).getScore();
      expect(score).to.not.be.undefined;
    });

    it("Should reject score retrieval from unregistered user", async function () {
      await expect(
        fheScore.connect(user2).getScore()
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Score Verification", function () {
    beforeEach(async function () {
      await fheScore.connect(user1).registerUser();
      await fheScore.connect(user1).calculateScore();
    });

    it("Should allow score verification", async function () {
      const verification = await fheScore.verifyScore(user1.address);
      expect(verification).to.not.be.undefined;
    });

    it("Should reject verification for unregistered user", async function () {
      await expect(
        fheScore.verifyScore(user2.address)
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Utility Functions", function () {
    it("Should check if user has calculated score", async function () {
      await fheScore.connect(user1).registerUser();
      
      expect(await fheScore.hasCalculatedScore(user1.address)).to.be.false;
      
      await fheScore.connect(user1).calculateScore();
      
      expect(await fheScore.hasCalculatedScore(user1.address)).to.be.true;
    });
  });
});