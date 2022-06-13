import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { AccountTokenTable } from '../AccountTokenTable';
import { AccountNFTTable } from '../AccountNFTTable/AccountNFTTable';

// TODO: Add state types or convert to react query
interface Props {
  account: any;
}

const AccountAssetTabDisconnected = ({ account }: Props) => {
  const assetTypes = ['token', 'nft'];
  const { id: accountId, assetType = assetTypes[0] } = useParams<{
    id: string;
    assetType: string;
  }>();
  console.log('ENV', process.env.REACT_APP_ENVIRONMENT);
  const supportsNFT = process.env.REACT_APP_ENVIRONMENT === 'nft_sandbox';
  const history = useHistory();
  const { t } = useTranslation();

  function switchAsset(event: ChangeEvent<HTMLInputElement>) {
    return history.push(`/accounts/${accountId}/assets/${event.target.value}`);
  }

  return (
    <>
      {supportsNFT && (
        <div className="radio-group">
          {assetTypes.map(type => {
            const fieldId = `tokens-${type}`;
            return (
              <label className={assetType === type ? 'selected' : ''} htmlFor={fieldId} key={type}>
                <input
                  type="radio"
                  id={fieldId}
                  name="assetType"
                  value={type}
                  checked={assetType === type}
                  onChange={switchAsset}
                />{' '}
                {t(`assets.${type}_tab_title`)}
              </label>
            );
          })}
        </div>
      )}
      <div className="tab-body">
        {assetType === 'token' && <AccountTokenTable account={account}></AccountTokenTable>}
        {assetType === 'nft' && <AccountNFTTable />}
      </div>
    </>
  );
};

export const AccountAssetTab = connect((state: any) => ({
  account: state.accountHeader.data,
}))(AccountAssetTabDisconnected);
