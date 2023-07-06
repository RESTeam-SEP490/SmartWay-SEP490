import './home.scss';

import React from 'react';

import { useAppSelector } from 'app/config/store';
import { Button, Image, Typography } from 'antd';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <>
      <div className="h-[calc(100vh-80px)] flex flex-col items-center">
        <div className="flex flex-col items-center justify-center grow">
          <Typography.Title className="text-center !text-blue-600">
            <Translate contentKey="global.landing.title" />
          </Typography.Title>
          <Typography.Paragraph className="text-lg text-center">
            <Translate contentKey="global.landing.para" />
          </Typography.Paragraph>
          <Link to={'/register'}>
            <Button
              size="large"
              className="w-56 font-semibold border-none text-white bg-gradient-to-br from-30% to-90% from-blue-600 to-sky-400 hover:to-65% hover:shadow-sm hover:!text-white hover:scale-110 duration-200"
            >
              <Translate contentKey="global.menu.account.start" />
            </Button>
          </Link>
        </div>
        <div className="bg-white shadow-2xl justify-self-end rounded-xl shadow-black">
          <Image src="../../../content/images/Mockup.png" preview={false} />
        </div>
      </div>
    </>
  );
};

export default Home;
