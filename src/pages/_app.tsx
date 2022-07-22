import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { enableReduxPersist, ReduxStore, reduxWrapper } from '../redux/store';
import userSlice from '../redux/features/userSlice';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const reduxStore    = useStore();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(
    () => {
      reduxStore.dispatch(userSlice.actions.visitRequest());
    },
    [reduxStore],
  );

  // return enableReduxPersist ? (
  //   <PersistGate
  //     loading={null}
  //     persistor={(reduxStore as ReduxStore).reduxPersistData}
  //   >
  //     <QueryClientProvider client={queryClient}>

  //       <Hydrate state={pageProps.dehydratedState}>
  //         {/* eslint-disable-next-line react/jsx-props-no-spreading */}
  //         <Component {...pageProps} />
  //       </Hydrate>

  //       <ReactQueryDevtools initialIsOpen={false} />

  //     </QueryClientProvider>
  //   </PersistGate>
  // ) : (
  //   <QueryClientProvider client={queryClient}>

  //     <Hydrate state={pageProps.dehydratedState}>
  //       {/* eslint-disable-next-line react/jsx-props-no-spreading */}
  //       <Component {...pageProps} />
  //     </Hydrate>

  //     <ReactQueryDevtools initialIsOpen={false} />

  //   </QueryClientProvider>
  // );

  return (
    <PersistGate
      loading={null}
      persistor={(reduxStore as ReduxStore).reduxPersistData}
    >
      {() => (
        <QueryClientProvider client={queryClient}>

          <Hydrate state={pageProps.dehydratedState}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </Hydrate>

          <ReactQueryDevtools initialIsOpen={false} />

        </QueryClientProvider>
      )}
    </PersistGate>
  );
};

export default reduxWrapper.withRedux(MyApp);
