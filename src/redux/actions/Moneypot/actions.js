import {moneypotConstants} from "../../constants";

import {store} from "../../../index";
import * as contract from "truffle-contract";
import MoneypotContract from "../../../build/contracts/MoneyPotSystem.json";

export const moneypotActions = {
  dispatchMoneypot,
  moneypotsInitialized,
  createMoneypot
};

function dispatchMoneypot(moneypot) {
  return {
    type: moneypotConstants.MONEYPOT_INITIALIZED,
    payload: {
      moneypot: moneypot,
    }
  };
}

function createMoneypot(name, description, beneficiary, donors) {
  const web3 = store.getState().web3.web3Instance;

  if (web3) {
    return dispatch => {
      // Using truffle-contract we create the authentication object.

      const moneypotContract = contract(MoneypotContract);
      moneypotContract.setProvider(web3.givenProvider);

      let moneypotInstance;

      moneypotContract.deployed().then((instance) => {
        moneypotInstance = instance;
        return moneypotInstance.createMoneyPot(name, description, beneficiary, donors, {
          from: store.getState().web3.account.wallet,
        });
      }).then((receipt) => {
        console.log(receipt);
      });
    };
  }
  else
  {
    console.error('Web3 is not initialized.');
  }

}

function moneypotsInitialized(wallet) {
  const web3 = store.getState().web3.web3Instance;

  if (web3) {
    return dispatch => {
      // Using truffle-contract we create the authentication object.

      const moneypotContract = contract(MoneypotContract);
      moneypotContract.setProvider(web3.givenProvider);

      // Declaring this for later so we can chain functions on Authentication.
      let moneypotInstance;

      moneypotContract.deployed().then((instance) => {
        moneypotInstance = instance;
        return moneypotInstance.getMyMoneyPotsIds(wallet);
      }).then((moneypotIds) => {
        moneypotIds.forEach((moneyPotId) => {

          let _moneypot = {};
          moneypotInstance.moneypots(moneyPotId.toNumber())
            .then((moneyPot) => {

              const open = moneyPot[6];

              if (open) {

              }

              _moneypot['id'] = moneyPot[0];
              _moneypot['author'] = moneyPot[1];
              _moneypot['beneficiary'] = moneyPot[2];
              _moneypot['name'] = moneyPot[3];
              _moneypot['description'] = moneyPot[4];
              _moneypot['donations'] = [];

              // 0 to moneypot donations count
              for (let id = 0; id < moneyPot[5].toNumber(); id++) {
                moneypotInstance.getDonation(moneyPotId.toNumber(), id).then((donation) => {
                  _moneypot['donations'].push({
                    donor: donation[0],
                    amount: donation[1],
                  });
                });
              }
              console.log(_moneypot);
              return moneypotInstance.getDonors(moneyPotId.toNumber());
            }).then((_donors) => {
              _moneypot['donors'] = _donors;
              return moneypotInstance.getMoneyPotAmount(moneyPotId.toNumber());
            }).then((_amount) => {
              _moneypot['amount'] = _amount;
            }).then(() => dispatch(dispatchMoneypot(_moneypot)));
        });
      });
    };
  } else {
    console.error('Web3 is not initialized.');
  }
}


