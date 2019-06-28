import {moneypotConstants} from "../../constants/Moneypot";

const initialState = {
  moneypots: [],
  current: null
};

export function moneypotReducer(state = initialState, action) {

  const {
    type,
    payload
  } = action;

  switch (type) {
  case moneypotConstants.MONEYPOTS_INITIALIZED:
    return {
      ...state,
      moneypots: payload.moneypots,
      current: payload.moneypots.shift()
    };
  default:
    return state;
  }
}
