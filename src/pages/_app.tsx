import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { ReduxStore, reduxWrapper } from '../redux/store';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const reduxStore    = useStore();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PersistGate
      loading={<div>Loading...</div>}
      persistor={(reduxStore as ReduxStore).reduxPersistData}
    >
      <QueryClientProvider client={queryClient}>

        <Hydrate state={pageProps.dehydratedState}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Hydrate>

        <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>
    </PersistGate>
  );
};

export default reduxWrapper.withRedux(MyApp);
