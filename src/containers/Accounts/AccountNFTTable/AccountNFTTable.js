import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useParams } from 'react-router';
import { concatNFT } from '../../shared/utils';
import { loadAccountNFTs } from './actions';
import Loader from '../../shared/components/Loader';
import SocketContext from '../../shared/SocketContext';

const AccountNFTTableDisconnected = props => {
  const [nfts, setNfts] = useState([]);
  const [marker, setMarker] = useState(null);
  const { t } = useTranslation();
  const { id: accountId } = useParams();
  const { actions, data, loading } = props;
  const rippledSocket = useContext(SocketContext);

  useEffect(() => {
    if (data.nfts == null) return;
    setMarker(data.marker);
    setNfts(oldNfts => {
      return concatNFT(oldNfts, data.nfts);
    });
  }, [accountId, data]);

  useEffect(() => {
    setNfts([]);
    setMarker(null);
    actions.loadAccountNFTs(accountId, undefined, rippledSocket);
  }, [accountId]);

  const loadMoreNfts = () => {
    actions.loadAccountNFTs(accountId, marker, rippledSocket);
  };

  function renderNoResults() {
    return (
      <tr>
        <td colSpan={3} className="empty-message">
          {t('assets.no_tokens_message')}
        </td>
      </tr>
    );
  }

  const renderRow = nft => {
    return (
      <tr key={nft.NFTokenID}>
        <td>{nft.NFTokenID}</td>
        <td>{nft.Issuer}</td>
        <td>{nft.NFTokenTaxon}</td>
      </tr>
    );
  };

  const renderLoadMoreButton = () => {
    return (
      marker && (
        <button type="button" className="load-more-btn" onClick={loadMoreNfts}>
          {t('load_more_action')}
        </button>
      )
    );
  };

  return (
    <div className="section nfts-table">
      <table className="basic">
        <thead>
          <tr className="transaction-li transaction-li-header">
            <td className="col-token-id">{t('token_id')}</td>
            <td className="col-issuer">{t('issuer')}</td>
            <td className="col-taxon">{t('taxon')}</td>
          </tr>
        </thead>
        <tbody>{!loading && (nfts?.length ? nfts.map(renderRow) : renderNoResults())}</tbody>
      </table>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  );
};

AccountNFTTableDisconnected.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    marker: PropTypes.string,
    nfts: PropTypes.any,
  }).isRequired,
  actions: PropTypes.shape({
    loadAccountNFTs: PropTypes.func,
  }).isRequired,
};

export const AccountNFTTable = connect(
  state => ({
    loading: state.accountNFTs.loading,
    data: state.accountNFTs.data,
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        loadAccountNFTs,
      },
      dispatch
    ),
  })
)(AccountNFTTableDisconnected);
