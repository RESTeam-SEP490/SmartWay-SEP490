import { ThemeConfig, MenuProps } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';

const blue = {
  50: '#f0f5fe',
  100: '#dce8fd',
  200: '#c1d7fc',
  300: '#96bffa',
  400: '#659df5',
  500: '#4d81f1',
  600: '#2b59e5',
  700: '#2346d2',
  800: '#233aaa',
  900: '#213687',
  950: '#192252',
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: blue[500],
    colorPrimaryHover: blue[600],
    colorPrimaryActive: blue[400],
    colorLink: blue[500],
    colorLinkHover: blue[600],
    colorLinkActive: blue[400],
    paddingContentVerticalLG: 10,
    padding: 10,
  },
};
