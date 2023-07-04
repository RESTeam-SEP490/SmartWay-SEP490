import { ThemeConfig, MenuProps } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';

const colors = {
  green: {
    50: '#E0FFF3',
    100: '#C7FFE9',
    200: '#8AFFD2',
    300: '#52FFBD',
    400: '#1AFFA7',
    500: '#00DB87',
    600: '#00A263',
    700: '#007A4B',
    800: '#005232',
    900: '#002919',
    950: '#00140D',
  },
  blue: {
    50: '#F1F5FE',
    100: '#E3EBFD',
    200: '#C2D3FA',
    300: '#A5BFF8',
    400: '#89ABF6',
    500: '#6C97F3',
    600: '#4D81F1',
    700: '#1152DE',
    800: '#0C3693',
    900: '#061C4C',
    950: '#030E26',
  },
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.blue[600],
    colorPrimaryHover: colors.blue[500],
    colorPrimaryActive: colors.blue[700],
    colorLink: colors.blue[600],
    colorLinkHover: colors.blue[500],
    colorLinkActive: colors.blue[700],
    paddingContentVerticalLG: 10,
    padding: 10,
    colorSuccess: colors.green[600],
    colorSuccessHover: colors.green[500],
    colorSuccessActive: colors.green[700],
    controlItemBgActive: colors.blue[100],
  },
  components: {
    Table: {
      colorFillAlter: '#fff',
    },
  },
};
