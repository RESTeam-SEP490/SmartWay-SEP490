import { ThemeConfig, MenuProps } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';

const colors = {
  green: {
    50: '#EEF7F0',
    100: '#E0F0E4',
    200: '#BEDFC5',
    300: '#9FD0AA',
    400: '#7DBF8B',
    500: '#5DB06F',
    600: '#469056',
    700: '#366E42',
    800: '#23482B',
    900: '#122617',
    950: '#08110A',
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
  red: {
    50: '#FCF3F2',
    100: '#F9E4E1',
    200: '#F3C8C4',
    300: '#EDADA6',
    400: '#E79288',
    500: '#E1766A',
    600: '#DB5B4D',
    700: '#BB3526',
    800: '#7B2319',
    900: '#40120D',
    950: '#1E0806',
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
    paddingContentVerticalLG: 12,
    padding: 12,
    colorText: colors.blue[950],
    colorSuccess: colors.green[600],
    colorSuccessHover: colors.green[500],
    colorSuccessActive: colors.green[700],
    colorError: colors.red[600],
    colorErrorHover: colors.red[500],
    colorErrorActive: colors.red[700],
    controlItemBgActive: colors.blue[100],
  },
  components: {
    Table: {
      colorFillAlter: '#fff',
    },
    Menu: {
      colorText: '#64748b',
      subMenuItemBg: '#fff',
    },
    Card: {
      colorBorderSecondary: '#e2e8f0',
    },
  },
};
