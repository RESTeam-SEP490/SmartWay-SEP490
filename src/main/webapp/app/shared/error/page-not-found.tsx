import { Result } from 'antd';
import React from 'react';
import { Translate } from 'react-jhipster';

const PageNotFound = () => {
  return (
    <div className="pt-14">
      <Result status="404" title="404" subTitle={<Translate contentKey="error.http.404">The page does not exist.</Translate>} />;
    </div>
  );
};

export default PageNotFound;
