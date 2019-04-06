pragma solidity ^0.5.0;

contract Owned {
  // State variable
  address payable owner;

  // Modifiers
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // constructor
  constructor() public {
    owner = msg.sender;
  }
}

contract MoneyPotSystem is Owned {
  // Custom types

  struct Donation {
    address payable donor;
    uint amount;
  }

  struct MoneyPot {
    uint id;
    address payable author;
    address payable beneficiary;
    string name;
    string description;
    address[] donors;
    mapping(uint32 => Donation) donations;
    uint32 donationsCounter;
    bool open;
  }

  // State variables
  mapping(uint => MoneyPot) public moneypots;
  mapping(address => uint256[]) public addressToMoneyPot;

  uint moneypotCounter;

  // Events
  event createMoneyPotEvent (
    uint indexed _id,
    address payable indexed _author,
    string _name
  );

  event chipInEvent (
    uint indexed _id,
    address payable indexed _donor,
    uint256 _amount,
    string _name
  );

  event closeEvent (
    uint indexed _id,
    address payable indexed _benefeciary,
    uint256 _amount,
    string _name
  );

  event addDonorEvent(
    uint indexed _id,
    address payable indexed _donor
  );

  constructor() public {
    moneypotCounter = 0;
  }

  function createMoneyPot(string memory _name, string memory _description, address payable _benefeciary, address[] memory _donors) public {
    require(_benefeciary != msg.sender);

    address[] memory donors = new address[](_donors.length + 1);

    uint j = 0;
    for (j ; j < _donors.length; j++) {
      donors[j] = _donors[j];
      addressToMoneyPot[_donors[j]].push(moneypotCounter);
    }

    donors[j] = msg.sender;
    addressToMoneyPot[msg.sender].push(moneypotCounter);

    moneypots[moneypotCounter] = MoneyPot(moneypotCounter, msg.sender, _benefeciary, _name, _description, donors, 0, true);

    // trigger the event
    emit createMoneyPotEvent(moneypotCounter, msg.sender, _name);

    moneypotCounter++;

  }
  /*
  function leaveMoneyPot(uint _id, address _donor) public {

    require(_id >= 0 && _id <= moneypotCounter);

    MoneyPot storage moneyPot = moneypots[_id];

    require(myMoneyPot.open);

    require(myMoneyPot.author != msg.sender);

    bool donorFound = false;

    for (uint j = 0; j < myMoneyPot.donors.length; j++) {
      if (myMoneyPot.donors[j] == _donor) {
        donorFound = true;
        break;
      }
    }
    require(donorFound);
    // do something
  }
  */

  function addDonor(uint _id, address payable _donor) public {

    // we check whether the money pot exists
    require(_id >= 0 && _id <= moneypotCounter);

    MoneyPot storage myMoneyPot = moneypots[_id];

    // we check if moneypot is open
    require(myMoneyPot.open);

    //check caller is author
    require(myMoneyPot.author == msg.sender);

    // check if donor already exist
    bool donorFound = false;

    for (uint j = 0; j < myMoneyPot.donors.length; j++) {
      if (myMoneyPot.donors[j] == _donor) {
        donorFound = true;
        break;
      }
    }
    require(!donorFound);

    // Add donor
    myMoneyPot.donors.push(_donor);
    addressToMoneyPot[_donor].push(_id);

    emit addDonorEvent(_id,_donor);
  }
  // fetch the number of money pots in the contract
  function getNumberOfMoneyPots() public view returns (uint256) {
    return moneypotCounter;
  }

  // fetch the number of money pots in the contract
  function getNumberOfMyMoneyPots() public view returns (uint256) {
    return addressToMoneyPot[msg.sender].length;
  }

  function getMyMoneyPotsIds(address who) public view returns (uint256[] memory) {
    return addressToMoneyPot[who];
  }

  function getDonors(uint256 moneyPotId) public view returns (address[] memory) {
    return moneypots[moneyPotId].donors;
  }

  function getDonation(uint moneyPotId , uint32 donationId) public view returns ( address donor, uint amount) {

    Donation storage donation = moneypots[moneyPotId].donations[donationId];

    return(donation.donor, donation.amount);
  }

  function chipIn(uint _id) payable public {
    require(moneypotCounter > 0);

    // we check whether the money pot exists
    require(_id >= 0 && _id <= moneypotCounter);

    // we retrieve the article
    MoneyPot storage myMoneyPot = moneypots[_id];

    // we check if moneypot is open
    require(myMoneyPot.open);

    //todo: forbidden to give if you are not a donor
    bool donorFound = false;

    for (uint j = 0; j < myMoneyPot.donors.length; j++) {
      if (myMoneyPot.donors[j] == msg.sender) {
        donorFound = true;
        break;
      }
    }

    require(donorFound);

    // Add donation
    myMoneyPot.donations[myMoneyPot.donationsCounter] = Donation(msg.sender, msg.value);
    myMoneyPot.donationsCounter += 1;

    // trigger the event
    emit chipInEvent(_id, msg.sender, msg.value, myMoneyPot.name);

  }

  function getMoneyPotAmount( uint _id ) public view returns (uint256) {
    require(moneypotCounter > 0);

    // we check whether the money pot exists
    require(_id >= 0 && _id <= moneypotCounter);

    // we retrieve the article
    MoneyPot storage myMoneyPot = moneypots[_id];

    uint256 amount = 0;

    for (uint32 j = 0; j < myMoneyPot.donationsCounter; j++) {
      amount += myMoneyPot.donations[j].amount;
    }

    return amount;
  }

  function close(uint _id) public {
    require(moneypotCounter > 0);

    require(_id >= 0 && _id <= moneypotCounter);

    MoneyPot storage myMoneyPot = moneypots[_id];

    //check caller is author or beneficiary
    require(msg.sender == myMoneyPot.author || msg.sender == myMoneyPot.beneficiary);

    //check open
    require(myMoneyPot.open);

    uint amount = getMoneyPotAmount(myMoneyPot.id);
    //check amount
    require(amount > 0);

    myMoneyPot.open = false;

    myMoneyPot.beneficiary.transfer(amount);

    emit closeEvent(_id, myMoneyPot.beneficiary, amount, myMoneyPot.name);
  }

  // kill the smart contract
  function kill() onlyOwner public {
    selfdestruct(owner);
  }
}
