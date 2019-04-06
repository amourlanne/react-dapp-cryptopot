const MoneyPotSystem = artifacts.require("../MoneyPotSystem.sol");

module.exports = function(deployer) {
  deployer.deploy(MoneyPotSystem);
}
