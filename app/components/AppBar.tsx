import { FC } from 'react';
import { Nav } from './Nav';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <span>Vanward</span>
      <Nav />
      <WalletMultiButtonDynamic />
    </div>
  );
};
