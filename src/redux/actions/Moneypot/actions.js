import {moneypotConstants} from "../../constants";

import {store} from "../../../index";
import * as contract from "truffle-contract";
import MoneypotContract from "../../../build/contracts/MoneyPotSystem.json";

export const moneypotActions = {
  dispatchMoneypots,
  moneypotsInitialized,
  createMoneypot
};

function dispatchMoneypots(moneypots) {
  return {
    type: moneypotConstants.MONEYPOTS_INITIALIZED,
    payload: {
      moneypots: moneypots,
    }
  };
}

function createMoneypot(name, description, beneficiary, donors) {
  const web3State = store.getState().web3;

  const web3 = web3State.web3Instance;
  const wallet = web3State.account.wallet;

  if (web3) {
    return async dispatch => {

      const moneypotContract = contract(MoneypotContract);
      moneypotContract.setProvider(web3.givenProvider);

      const moneypotInstance = await moneypotContract.deployed();

      const receipt = await moneypotInstance.createMoneyPot(name, description, beneficiary, donors, {
          from: wallet,
      });

      if(receipt) dispatch(moneypotsInitialized());

    };
  }
  else
  {
    console.error('Web3 is not initialized.');
  }

}

function moneypotsInitialized() {
  const web3State = store.getState().web3;

  const web3 = web3State.web3Instance;
  const wallet = web3State.account.wallet;

  if (web3) {
    return async dispatch => {
      // Using truffle-contract we create the authentication object.


      let moneyPotContract = contract(MoneypotContract);
      moneyPotContract.setProvider(web3.givenProvider);


      const moneypotInstance = await moneyPotContract.deployed();

      const myMoneyPotsIds = await moneypotInstance.getMyMoneyPotsIds(wallet);

      let moneyPots = [];

      for(const moneyPotId in myMoneyPotsIds) {

          const moneyPot = await moneypotInstance.moneypots(moneyPotId);

          if(!moneyPot[6]) continue;

          let data = {
              "id": moneyPot[0],
              "author": moneyPot[1],
              "beneficiary": moneyPot[2],
              "name": moneyPot[3],
              "description": moneyPot[4],
              "donations": []
          };

          for (let id = 0; id < moneyPot[5].toNumber(); id++) {
              const donation = await moneypotInstance.getDonation(moneyPotId, id);

              data["donations"].push({
                  donor: donation[0],
                  amount: donation[1],
              });
          }

          const donors = await moneypotInstance.getDonors(moneyPotId);
          const amount = await moneypotInstance.getMoneyPotAmount(moneyPotId);

          data["donors"] = donors;
          data["amount"] = amount;

          moneyPots.push(data);
      }
      dispatch(dispatchMoneypots(moneyPots));
    };
  } else {
    console.error('Web3 is not initialized.');
  }
}


