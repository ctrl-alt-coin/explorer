import { analytics, ANALYTIC_TYPES } from '../../shared/utils';
import * as actionTypes from './actionTypes';
import { getAccountNFTs } from '../../../rippled/lib/rippled';

export const loadAccountNFTs = (accountId, marker, rippledSocket) => dispatch => {
  dispatch({
    type: actionTypes.START_LOADING_ACCOUNT_NFTS,
  });
  return getAccountNFTs(rippledSocket, accountId, marker)
    .then(data => {
      dispatch({
        type: actionTypes.ACCOUNT_NFTS_LOAD_SUCCESS,
        data: {
          nfts: data.account_nfts,
          marker: data.marker,
        },
      });
    })
    .catch(error => {
      const errorLocation = `account NFTs ${accountId} at ${marker}`;
      analytics(ANALYTIC_TYPES.exception, {
        exDescription: `${errorLocation} --- ${JSON.stringify(error)}`,
      });
      dispatch({
        type: actionTypes.ACCOUNT_NFTS_LOAD_FAIL,
        error: 'get_account_nfts_failed',
      });
    });
};
export { loadAccountNFTs as default };
