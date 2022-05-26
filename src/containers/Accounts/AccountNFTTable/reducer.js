import * as actionTypes from './actionTypes';

export const initialState = {
  loading: false,
  data: {},
  error: '',
};

const accountNFTReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOADING_ACCOUNT_NFTS:
      return { ...state, loading: true, data: {} };
    case actionTypes.ACCOUNT_NFTS_LOAD_SUCCESS:
      return { ...state, error: '', data: action.data, loading: false };
    case actionTypes.ACCOUNT_NFTS_LOAD_FAIL:
      return {
        ...state,
        error: action.error,
        data: state.data.length ? state.data : {},
        loading: false,
      };
    case 'persist/REHYDRATE':
      return { ...initialState };
    default:
      return state;
  }
};

export default accountNFTReducer;
