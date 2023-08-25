import { Button, Result } from 'antd';
import React from 'react';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white">
      <Result
        status="404"
        title="404"
        extra={
          <Link to={'/login'}>
            <Button type="primary">Back Home</Button>
          </Link>
        }
        subTitle={<Translate contentKey="error.http.404">The page does not exist.</Translate>}
      />
      ;
    </div>
  );
};

export default PageNotFound;
