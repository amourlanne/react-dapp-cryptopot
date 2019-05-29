// Contract to be tested

const assert = require('assert');
const MoneyPotSystem = artifacts.require("./MoneyPotSystem.sol");

const {toWei, fromWei, toBN} = web3.utils;
const {getBalance} = web3.eth;
const {equal, strictEqual} = assert;
const toWeiBN = (value) => toBN(toWei(value.toString()));

const fromWeiToNumber = (value) => Number(fromWei(value));
const fromBNtoNumber = (value) => Number(value);

// Test suite
contract('MoneyPotSystem', function (accounts) {

    const author = accounts[0];

    const sender = accounts[5];
    const beneficiary = accounts[6];
    const donors = [accounts[7], accounts[8], accounts[9]];

    let MoneyPotSystemInstance = null;
    let moneyPotId = null;
    let feesAmount = null;
    let balance_before = null;
    let numberOfChip = 0;


    // Test case: check initial values
    it("should be initialized with empty values", async () => {

        const instance = await MoneyPotSystem.deployed();

        const numberOfMoneyPots = await instance.getNumberOfMoneyPots();
        const numberOfMyMoneyPots = await instance.getNumberOfMyMoneyPots();

        strictEqual(fromBNtoNumber(numberOfMoneyPots), 0, "number of money pots must be zero");
        strictEqual(fromBNtoNumber(numberOfMyMoneyPots), 0, "number of my money pots should be zero");
    });

    it("should let us create a money pot", async () => {

        const instance = await MoneyPotSystem.deployed();

        const moneyPot = await instance.createMoneyPot("Anniversaire Perrine", "Lorem lipsum", beneficiary, donors, {
            from: author
        });

        const {logs} = moneyPot;
        const {args, event} = logs[0];
        const {_id, _author, _name} = args;

        strictEqual(logs.length, 1, "should have received one event");
        strictEqual(event, "createMoneyPotEvent", "event name should be createMoneyPotEvent");
        strictEqual(fromWeiToNumber(_id), 0, "id must be 0");
        strictEqual(_author, author, "author must be " + author);
        strictEqual(_name, "Anniversaire Perrine", "article name must be " + "Anniversaire Perrine");

        const numberOfMoneyPots = await instance.getNumberOfMoneyPots();
        const numberOfMyMoneyPots = await instance.getNumberOfMyMoneyPots();
        const myMoneyPotsIds = await instance.getMyMoneyPotsIds(author);

        strictEqual(fromBNtoNumber(numberOfMoneyPots), 1, "number of money pots must be one");
        strictEqual(fromBNtoNumber(numberOfMyMoneyPots), 1, "number of my money pots should be one");
        strictEqual(myMoneyPotsIds.length, 1, "number of money pot ids must be one");

        const moneyPotId = fromBNtoNumber(myMoneyPotsIds[0]);

        strictEqual(moneyPotId, 0, "id must be 0");

        const retrieveMoneyPot = await instance.moneypots(moneyPotId);
        const retrieveMoneyPotDonors = await instance.getDonors(moneyPotId);

        strictEqual(retrieveMoneyPot[3], "Anniversaire Perrine", "article name must be Anniversaire Perrine");
        strictEqual(fromWeiToNumber(retrieveMoneyPot[5]), 0, "Amount must be zero");
        strictEqual(retrieveMoneyPot[1], author, "Author must be account 0");
        strictEqual(retrieveMoneyPot[2], beneficiary, "Benefeciary must be account 6");

        strictEqual(retrieveMoneyPotDonors.length, donors.length + 1, "4 donors only (3 donors and author)");

    });

    it("should let us add cash and check total", () =>
        MoneyPotSystem.deployed().then((instance) => {
            MoneyPotSystemInstance = instance;
            return MoneyPotSystemInstance.createMoneyPot("Anniversaire François", "Lorem lipsum", beneficiary, donors, {
                from: author
            });
        }).then((receipt) => {
            const {_id, _feesAmount} = receipt.logs[0].args;
            moneyPotId = _id;
            feesAmount = _feesAmount;

            return MoneyPotSystemInstance.chipIn(moneyPotId, {
                from: donors[0],
                value: toWeiBN(2).add(feesAmount)
            });
        }).then((receipt) => {
            numberOfChip++;
            const {_donor, _donation} = receipt.logs[0].args;

            strictEqual(_donor, donors[0]);
            strictEqual(fromWeiToNumber(_donation), 2);

            return MoneyPotSystemInstance.chipIn(moneyPotId, {
                from: donors[1],
                value: toWeiBN(3).add(feesAmount)
            });
        }).then((receipt) => {
            numberOfChip++;
            const {_donor, _donation} = receipt.logs[0].args;

            strictEqual(_donor, donors[1]);
            strictEqual(fromWeiToNumber(_donation), 3);

            return MoneyPotSystemInstance.getMoneyPotAmount(moneyPotId);
        }).then((amount) => {
            equal(fromWeiToNumber(amount), 5, "Amount must be 5 ether");
        })
    );

    it("should let us add cash, close and check beneficiary balance", () =>
        MoneyPotSystem.deployed().then((instance) => {
            MoneyPotSystemInstance = instance;
            return MoneyPotSystemInstance.createMoneyPot("Anniversaire François", "Lorem lipsum", beneficiary, donors, {
                from: author
            });
        }).then((receipt) => {

            const {_id, _feesAmount} = receipt.logs[0].args;
            moneyPotId = _id;
            feesAmount = _feesAmount;

            return MoneyPotSystemInstance.chipIn(moneyPotId, {
                from: donors[0],
                value: toWeiBN(2).add(feesAmount)
            });
        }).then((receipt) => {
            numberOfChip++;
            const {_donor, _donation} = receipt.logs[0].args;

            strictEqual(_donor, donors[0]);
            strictEqual(fromWeiToNumber(_donation), 2);

            return MoneyPotSystemInstance.chipIn(moneyPotId, {
                from: donors[1],
                value: toWeiBN(3).add(feesAmount)
            });
        }).then((receipt) => {
            numberOfChip++;
            const {_donor, _donation} = receipt.logs[0].args;

            strictEqual(_donor, donors[1]);
            strictEqual(fromWeiToNumber(_donation), 3);

            return MoneyPotSystemInstance.getMoneyPotAmount(moneyPotId);
        }).then((amount) => {

            strictEqual(fromWeiToNumber(amount), 5, "Amount must be 5 ether");

            return getBalance(beneficiary);
        }).then((beneficiaryBalance) => {
            balance_before = beneficiaryBalance;
            return MoneyPotSystemInstance.close(moneyPotId);
        }).then((receipt) => {
            const {_benefeciary, _amount} = receipt.logs[0].args;

            strictEqual(_benefeciary, beneficiary, "Benefeciary must be " + beneficiary);
            strictEqual(fromWeiToNumber(_amount), 5, "Amount must be 5 ether");

            return getBalance(beneficiary)
        }).then((beneficiaryBalanceAfter) => {

            strictEqual(fromWeiToNumber(beneficiaryBalanceAfter), fromWeiToNumber(balance_before) + 5, "beneficiary must win 5 ether")

            return MoneyPotSystemInstance.moneypots(moneyPotId);
        }).then((moneypot) => {
            strictEqual(false, moneypot[6], "Moneypot must be closed");
        })
    );

    it("should let us add donor and check donor moneypot", function () {
        return MoneyPotSystem.deployed().then(function (instance) {
            MoneyPotSystemInstance = instance;
            return MoneyPotSystemInstance.createMoneyPot("Anniversaire François", "Lorem lipsum", beneficiary, [donors[0], donors[1]], {
                from: author
            });
        }).then(function (receipt) {

            const {_id} = receipt.logs[0].args;

            moneyPotId = _id;

            return MoneyPotSystemInstance.addDonor(moneyPotId, donors[2]);
        }).then(function (receipt) {

            const {_donor, _id} = receipt.logs[0].args;

            strictEqual(_donor, donors[2]);
            strictEqual(fromWeiToNumber(_id), fromWeiToNumber(moneyPotId));

            return MoneyPotSystemInstance.getMyMoneyPotsIds(donors[2]);
        }).then(function (moneyPotIds) {
            let idFound = false;

            moneyPotIds.forEach((_moneyPotId) => {
                if (fromWeiToNumber(_moneyPotId) === fromWeiToNumber(moneyPotId)) {
                    idFound = true;
                    return;
                }
            });
            strictEqual(true, idFound, "Donor have moneypot");
        });
    });


    it("should let us add cash and check if beneficiary can close own moneypot", () =>
        MoneyPotSystem.deployed().then((instance) => {
            MoneyPotSystemInstance = instance;
            return MoneyPotSystemInstance.createMoneyPot("Mon pot commun", "Lorem lipsum", beneficiary, donors, {
                from: author
            });
        }).then((receipt) => {
            const {_id, _feesAmount} = receipt.logs[0].args;

            moneyPotId = _id;
            feesAmount = _feesAmount;

            return MoneyPotSystemInstance.chipIn(moneyPotId, {
                from: donors[0],
                value: toWeiBN(10).add(feesAmount)
            });
        }).then((receipt) => {
            numberOfChip++;
            const {_donor, _donation} = receipt.logs[0].args;

            strictEqual(_donor, donors[0]);
            strictEqual(fromWeiToNumber(_donation), 10);

            return getBalance(beneficiary);
        }).then((beneficiaryBalance) => {
            balance_before = beneficiaryBalance;

            return MoneyPotSystemInstance.close(moneyPotId, {
                from: beneficiary
            });
        }).then((receipt) => {
            const {_benefeciary, _amount} = receipt.logs[0].args;

            strictEqual(_benefeciary, beneficiary, "Benefeciary must be " + beneficiary);
            strictEqual(fromWeiToNumber(_amount), 10, "Amount must be 10 ether");

            return MoneyPotSystemInstance.moneypots(moneyPotId);
        }).then((moneypot) => {
            strictEqual(moneypot[6], false, "Moneypot must be closed");
        })
    );

    it("should let ship in and check fees", () =>
        MoneyPotSystem.deployed().then((instance) => {
            MoneyPotSystemInstance = instance;
            return getBalance(author);
        }).then((balance) => {
            balance_before = toBN(balance);

            return MoneyPotSystemInstance.createMoneyPot("Mon pot commun", "Lorem lipsum", beneficiary, donors, {
                from: sender
            });
        }).then((receipt) => {
            const {_id, _feesAmount} = receipt.logs[0].args;

            moneyPotId = _id;
            feesAmount = _feesAmount;

            return MoneyPotSystemInstance.chipIn(moneyPotId, {
                from: donors[0],
                value: toWeiBN(10).add(feesAmount)
            });
        }).then(() => {
            numberOfChip++;
            return MoneyPotSystemInstance.getFees();
        }).then((fees) => {
            strictEqual(Number(fees), Number(feesAmount.muln(numberOfChip)), "Fees is feesamount mult by numberofchip");
        })
    );
});
