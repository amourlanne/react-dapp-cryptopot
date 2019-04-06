// Contract to be tested
var MoneyPotSystem = artifacts.require("./MoneyPotSystem.sol");

// Test suite
contract('MoneyPotSystem', function(accounts) {
  let MoneyPotSystemInstance;
  var watcher;
  var author = accounts[0];
  var beneficiary = accounts[6];
  var beneficiary_before = 0;
  var donors = [accounts[7], accounts[8], accounts[9]];
  var moneyPotId;

  // Test case: check initial values
  it("should be initialized with empty values", function() {
    return MoneyPotSystem.deployed().then(function(instance) {
      MoneyPotSystemInstance = instance;
      return MoneyPotSystemInstance.getNumberOfMoneyPots();
    }).then(function(data) {
      assert.equal(data, 0x0, "number of money pots must be zero");
      return MoneyPotSystemInstance.getNumberOfMyMoneyPots();
    }).then(function(data){
      assert.equal(data, 0x0, "number of my money pots should be zero");
    });
  });

  // Test case: check initial values
/*  it("should be initialized with empty values", () => {
    MoneyPotSystem.deployed()
      .then(instance => {
        MoneyPotSystemInstance = instance;
        return MoneyPotSystemInstance.getNumberOfMoneyPots();
      })
      .then(numberOfMoneyPots => {
        assert.equal(
          numberOfMoneyPots.valueOf(),
          0,
          "number of money pots must be zero");
        return MoneyPotSystemInstance.getNumberOfMyMoneyPots();
      })
      .then((numberOfMyMoneyPots) => {
        assert.equal(
          numberOfMyMoneyPots.valueOf(),
          0,
          "number of my money pots should be zero");
      });
  });*/


  it("should let us create a money pot", function() {
    return MoneyPotSystem.deployed().then(function(instance) {
      MoneyPotSystemInstance = instance;
      return MoneyPotSystemInstance.createMoneyPot("Anniversaire Perrine", "Lorem lipsum", beneficiary, donors, {
        from: author
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "should have received one event");
      assert.equal(receipt.logs[0].event, "createMoneyPotEvent", "event name should be createMoneyPotEvent");
      assert.equal(receipt.logs[0].args._id.toNumber(), 0, "id must be 0");
      assert.equal(receipt.logs[0].args._author, author, "author must be " + author);
      assert.equal(receipt.logs[0].args._name, "Anniversaire Perrine", "article name must be " + "Anniversaire Perrine");

      return MoneyPotSystemInstance.getNumberOfMoneyPots();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "number of money pot must be one");

      return MoneyPotSystemInstance.getNumberOfMyMoneyPots();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "number of my money pot must be one");

      return MoneyPotSystemInstance.getMyMoneyPotsIds(author);
    }).then(function(data) {
      assert.equal(data.length, 1, "number of money pot ids must be one");
      assert.equal(data[0].toNumber(), 0, "id must be 0");

      return MoneyPotSystemInstance.moneypots(data[0].toNumber());
    }).then(function(data) {
      assert.equal(data[3], "Anniversaire Perrine", "article name must be Anniversaire Perrine");
      assert.equal(data[5].toNumber(), 0, "Amount must be zero");
      assert.equal(data[1], author, "Author must be account 0");
      assert.equal(data[2], beneficiary, "Benefeciary must be account 6");

      return MoneyPotSystemInstance.getDonors(data[0]);
    }).then(function(data) {
      assert.equal(data.length, 4, "4 donors only");
    });
  });

  it("should let us add cash and check total", function() {
    return MoneyPotSystem.deployed().then(function(instance) {
      MoneyPotSystemInstance = instance;
      return MoneyPotSystemInstance.createMoneyPot("Anniversaire François", "Lorem lipsum", beneficiary, donors, {
        from: author
      });
    }).then(function(receipt) {
      moneyPotId = receipt.logs[0].args._id;

      return MoneyPotSystemInstance.chipIn(moneyPotId, {
        from: donors[0],
        value: web3.utils.toWei("2", "ether")
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._donor, donors[0]);
      assert.equal(receipt.logs[0].args._amount, web3.utils.toWei("2", "ether"));

      return MoneyPotSystemInstance.chipIn(moneyPotId, {
        from: donors[1],
        value: web3.utils.toWei("3", "ether")
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._donor, donors[1]);
      assert.equal(receipt.logs[0].args._amount, web3.utils.toWei("3", "ether"));

      return MoneyPotSystemInstance.getMoneyPotAmount(moneyPotId);
    }).then(function(amount) {
      assert.equal(amount, web3.utils.toWei("5", "ether"), "Amount must be 5 ether");
    });
  });

  it("should let us add cash, close and check beneficiary balance", function() {
    return MoneyPotSystem.deployed().then(function(instance) {
      MoneyPotSystemInstance = instance;
      return MoneyPotSystemInstance.createMoneyPot("Anniversaire François", "Lorem lipsum", beneficiary, donors, {
        from: author
      });
    }).then(function(receipt) {
      moneyPotId = receipt.logs[0].args._id;

      return MoneyPotSystemInstance.chipIn(moneyPotId, {
        from: donors[0],
        value: web3.utils.toWei("2", "ether")
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._donor, donors[0]);
      assert.equal(receipt.logs[0].args._amount, web3.utils.toWei("2", "ether"));

      return MoneyPotSystemInstance.chipIn(moneyPotId, {
        from: donors[1],
        value: web3.utils.toWei("3", "ether")
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._donor, donors[1]);
      assert.equal(receipt.logs[0].args._amount, web3.utils.toWei("3", "ether"));

      return MoneyPotSystemInstance.getMoneyPotAmount(moneyPotId);
    }).then(function(amount) {
      assert.equal(amount, web3.utils.toWei("5", "ether"), "Amount must be 5 ether");
      return web3.eth.getBalance(beneficiary);
    }).then(function (beneficiaryBalance) {
      beneficiary_before = beneficiaryBalance;
      return MoneyPotSystemInstance.close(moneyPotId);
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._benefeciary, beneficiary, "Benefeciary must be " + beneficiary);
      assert.equal(receipt.logs[0].args._amount, web3.utils.toWei("5", "ether"), "Amount must be 5 ether");

      return web3.eth.getBalance(beneficiary)
    }).then(function(beneficiaryBalanceAfter) {

      var beneficiary_after =  Number(beneficiary_before) + Number(web3.utils.toWei("5", "ether"));
      assert.equal(beneficiaryBalanceAfter, beneficiary_after, "beneficiary must win 5 ether")

      return MoneyPotSystemInstance.moneypots(moneyPotId);
    }).then(function(data) {
      assert.isFalse(data[6], "Moneypot must be closed");
    });
  });

    it("should let us add donor and check donor moneypot", function() {
        return MoneyPotSystem.deployed().then(function(instance) {
            MoneyPotSystemInstance = instance;
            return MoneyPotSystemInstance.createMoneyPot("Anniversaire François", "Lorem lipsum", beneficiary, [donors[0], donors[1]], {
                from: author
            });
        }).then(function(receipt) {
            moneyPotId = receipt.logs[0].args._id;

            return MoneyPotSystemInstance.addDonor(moneyPotId, donors[2]);
        }).then(function(receipt) {
            assert.equal(receipt.logs[0].args._donor, donors[2]);
            assert.equal(receipt.logs[0].args._id.toNumber(), moneyPotId.toNumber());

            return MoneyPotSystemInstance.getMyMoneyPotsIds(donors[2]);
        }).then(function(moneyPotIds) {
            var idFound = false;
            moneyPotIds.forEach((_moneyPotId) => {
                if(_moneyPotId.toNumber() === moneyPotId.toNumber()) {
                    idFound = true;
                    return;
                }
            });
            assert.isTrue(idFound, "Donor have moneypot");
        });
    });
});
