import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Typography } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { languages } from 'app/config/translation';
import { setLocale } from 'app/shared/reducers/locale';
import React from 'react';
import { Storage } from 'react-jhipster';

export const LocaleMenu = ({ currentLocale }: { currentLocale: string }) => {
  const dispatch = useAppDispatch();

  const handleLocaleChange = langKey => {
    Storage.local.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const items: MenuProps['items'] = Object.entries(languages).map((lang, index) => {
    return { key: index + '', label: <div onClick={() => handleLocaleChange(lang[0])}>{lang[1]['name']}</div> };
  });

  const currentLocaleObj = Object.entries(languages).find(lang => lang[0] === currentLocale);

  return (
    Object.keys(languages).length > 1 && (
      <Dropdown menu={{ items }} className="!w-32">
        <Button className="flex items-center justify-between gap-2 p-2 cursor-pointer ">
          <div className="flex items-center">
            <GlobalOutlined rev={GlobalOutlined} className="mr-2" />
            <Typography.Text>{currentLocaleObj && currentLocaleObj[1]['name']}</Typography.Text>
          </div>
          <DownOutlined rev={DownOutlined} className="text-sm" />
        </Button>
      </Dropdown>
    )
  );
};
