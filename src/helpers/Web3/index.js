import { store } from "../../index";

export const web3Helper = {
  toETH,
};

function toETH(value) {
  if(value) {
    const web3 = store.getState().web3.web3Instance;
    if(web3) {
      const { fromWei } = web3.utils;
      return Number(fromWei(value, "ether"));
    }
  }
};
