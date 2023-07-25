import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DOMAIN_DEV, DOMAIN_PROD } from 'app/app.constant';
import { getAppTypeAndSubdomain } from '../util/subdomain/helpers';
import { serializeAxiosError } from './reducer.utils';

const initialState = {
  ribbonEnv: '',
  inProduction: null,
  isOpenAPIEnabled: false,
  appType: '',
  domain: '',
  subdomain: '',
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export const getProfile = createAsyncThunk('applicationProfile/get_profile', async () => axios.get<any>('api/management/info'), {
  serializeError: serializeAxiosError,
});

export const ApplicationProfileSlice = createSlice({
  name: 'applicationProfile',
  initialState: initialState as ApplicationProfileState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.ribbonEnv = data['display-ribbon-on-profiles'];
      const isInProd = data.activeProfiles.includes('prod');
      state.inProduction = isInProd;
      state.domain = isInProd ? DOMAIN_PROD : DOMAIN_DEV;
      const { appType, subdomain } = getAppTypeAndSubdomain(window.location.host, isInProd);
      state.appType = appType;
      state.subdomain = subdomain;
      state.isOpenAPIEnabled = data.activeProfiles.includes('api-docs');
    });
  },
});

// Reducer
export default ApplicationProfileSlice.reducer;
