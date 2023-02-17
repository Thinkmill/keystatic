import { AppProps } from 'next/app';
import './global.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
