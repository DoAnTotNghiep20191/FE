import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import 'src/assets/scss/_themes.scss';
import 'src/assets/scss/variable.scss';
import './App.scss';
import Layout from './components/Layout';
import LocaleProviderComponent from './components/Locale-provider';
import ToastContext from './contexts/toast';
import './i18n';
import Routes from './routes/Routes';
import { persistor, store } from './store';
import { ConfigProvider } from 'antd';
import { ThemeConfig } from 'antd/lib';
import WalletContextProvider from './components/ContextProvider/WalletContextProvider';
import { GiftAuth } from './contexts/gift-auth/gift-auth.context';
import Web3AuthProvider from './web3Auth/Web3AuthProvider';
import RudderStackProvider from './rudderstack/RudderStackProvider';
import { Libraries, useLoadScript } from '@react-google-maps/api';
import { KEY_GOOGLE_MAP } from './constants/env';
import PublicPostModalProvider from './components/ContextProvider/PublicPostVerifyProvider';

dayjs.extend(utc);

const customTheme: ThemeConfig = {
  token: {
    fontFamily: 'Elza Text',
  },
};

const libraries: Libraries = ['marker', 'places'];

const App: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: KEY_GOOGLE_MAP,
    libraries,
    language: 'en',
    region: 'AU',
  });

  // for preload error after redeploying web
  window.addEventListener('vite:preloadError', () => {
    window.location.reload();
  });
  // end check error
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocaleProviderComponent>
          <RudderStackProvider>
            <Web3AuthProvider>
              <BrowserRouter>
                <WalletContextProvider>
                  <ConfigProvider theme={customTheme}>
                    <GiftAuth>
                      <PublicPostModalProvider>
                        {isLoaded && (
                          <Layout>
                            <ToastContext />
                            <Routes />
                          </Layout>
                        )}
                      </PublicPostModalProvider>
                    </GiftAuth>
                  </ConfigProvider>
                </WalletContextProvider>
              </BrowserRouter>
            </Web3AuthProvider>
          </RudderStackProvider>
        </LocaleProviderComponent>
      </PersistGate>
    </Provider>
  );
};

export default App;
