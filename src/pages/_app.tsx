import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { Provider as ReduxSagaProvider } from "react-redux";
import { reduxWrapper } from "../redux/store";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
      <QueryClientProvider client={queryClient}>

        <Hydrate state={pageProps.dehydratedState}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Hydrate>

        <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>
  );
};

export default reduxWrapper.withRedux(MyApp);
