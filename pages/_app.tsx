import type { AppProps } from 'next/app';
import '../styles/darikami.css'; 
function awusahrul({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default awusahrul;
