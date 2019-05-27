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
  case moneypotConstants.MONEYPOT_INITIALIZED:
    return {
      ...state,
      moneypots: [...state.moneypots, payload.moneypot]
    };
  default:
    return state;
  }
}
