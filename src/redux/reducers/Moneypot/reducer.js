import {moneypotConstants} from "../../constants/Moneypot";

const initialState = {
  moneypots: [],
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
      moneypots: payload.moneypots
    };
  default:
    return state;
  }
}
